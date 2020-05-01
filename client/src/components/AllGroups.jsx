import React, { useEffect, useState } from 'react';

//Tostify
import { toast } from 'react-toastify';

//Redux
import store from '../redux/store';
import { connect } from 'react-redux';

//Actions
import { getUserGroups } from '../redux/actions/groupActions';
import { setCurrentSection } from '../redux/actions/userActions';

//Compoenents
import GroupPreview from './GroupPreview';

function AllGroups(props) {
  const [groups, changeGroups] = useState([]);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      changeGroups(store.getState().groups.groups);
    });

    store.dispatch(getUserGroups(props.userId));

    return () => {
      unsubscribe();
    };
  }, []);

  // useEffect(() => {

  // }, [props.allgroups])

  return (
    <div className="d-flex flex-column" id="groups">
      {props.errors !== null &&
        props.errors['group'] &&
        !toast.isActive('grouptoast') &&
        toast(props.errors.bug, {
          toastId: 'grouptoast',
          type: 'error',
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          onClose: () => {
            props.clearErrors();
          },
        })}
      <div className="action-bar m-l-16">
        <button
          onClick={() => {
            props.setCurrentSection('group/join');
          }}
        >
          Join Group
        </button>
      </div>
      {groups && groups.length > 0 && props.search === ''
        ? groups.map((group) => <GroupPreview group={group} key={group._id} />)
        : groups.map((group) => {
            if (
              group.name.toLowerCase().indexOf(props.search.toLowerCase()) > -1
            )
              return <GroupPreview group={group} key={group._id} />;
          })}
    </div>
  );
}

const mapDispatchToProps = {
  setCurrentSection,
};

const mapStateToProps = (state) => ({
  allgroups: state.groups.groups,
  errors: state.user.errors,
});

export default connect(mapStateToProps, mapDispatchToProps)(AllGroups);
