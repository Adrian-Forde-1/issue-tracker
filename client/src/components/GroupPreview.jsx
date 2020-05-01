import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

//Components
import DeleteModal from './DeleteModal';

//Redux
import { connect } from 'react-redux';

//Actions
import { setCurrentId, setCurrentSection } from '../redux/actions/userActions';
import { getUserGroups } from '../redux/actions/groupActions';

function GroupPreview(props) {
  const { group } = props;
  return (
    <div className="preview">
      {/* <Link to={`/group/${group._id}`}>
        <h6>{group.name}</h6>
      </Link> */}

      <button
        onClick={() => {
          props.setCurrentSection('group');
          props.setCurrentId(group._id);
        }}
      >
        {group.name}
      </button>

      {group.createdBy.toString() === props.user._id.toString() ? (
        <span className="margin-left-auto">
          <i
            className="far fa-trash-alt delete-btn"
            onClick={() => {
              const element = document.createElement('div');
              element.classList.add('modal-element');
              document.querySelector('#modal-root').appendChild(element);
              ReactDOM.render(
                <DeleteModal item={group} type={'group'} />,
                element
              );
            }}
          ></i>
        </span>
      ) : (
        <span className="margin-left-auto">
          <i
            className="fas fa-door-open delete-btn"
            onClick={() => {
              axios
                .put(`/api/leave/group/${group._id}`, null, {
                  headers: {
                    Authorization: localStorage.getItem('token'),
                  },
                })
                .then(() => {
                  props.getUserGroups(props.user._id);
                })
                .catch((error) => {
                  props.setErrors(error.response.data);
                  props.setCurrentSection('');
                  props.setCurrentId('');
                });
            }}
          ></i>
        </span>
      )}
    </div>
  );
}

const mapDispatchToProps = {
  setCurrentSection,
  setCurrentId,
  getUserGroups,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupPreview);
