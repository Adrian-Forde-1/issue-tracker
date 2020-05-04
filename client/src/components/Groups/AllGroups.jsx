import React, { useEffect, useState } from 'react';

//Tostify
import { toast } from 'react-toastify';

//Redux
import { connect } from 'react-redux';

//Actions
import { setCurrentSection } from '../../redux/actions/userActions';

//Compoenents
import GroupPreview from '../Preview/GroupPreview';

function AllGroups(props) {
  const [groups, changeGroups] = useState([]);

  useEffect(() => {
    changeGroups(props.groups);
  }, []);

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
  groups: state.groups.groups,
  errors: state.user.errors,
});

export default connect(mapStateToProps, mapDispatchToProps)(AllGroups);
