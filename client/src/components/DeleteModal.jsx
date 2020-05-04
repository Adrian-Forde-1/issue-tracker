import React from 'react';
import axios from 'axios';

//Redux
import store from '../redux/store';

//Actions
import {
  getUserProjects,
  setProjectUpdated,
} from '../redux/actions/projectActions';
import { getUserTeams, setTeamUpdated } from '../redux/actions/teamActions';
import { SET_ERRORS } from '../redux/actions/types';

function DeleteModal(props) {
  const { item, type, teamId, reRoute } = props;

  const closeModal = () => {
    const element = document.querySelector('.modal-element');
    document.querySelector('#modal-root').removeChild(element);
    if (reRoute !== null && typeof reRoute === 'function') reRoute();
  };

  const deleteItem = (type, id, teamId, cb) => {
    axios
      .delete(`/api/${type}/${id}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then(() => {
        if (type === 'project') {
          store.dispatch(getUserProjects(localStorage.getItem('token')));

          if (teamId !== null) {
            store.dispatch(getUserTeams(localStorage.getItem('token')));
            store.dispatch(setTeamUpdated(true));
          }
          cb();
        }
        if (type === 'bug') {
          store.dispatch(setProjectUpdated(true));
          props.history.replace(`/project/${item.project._id}`);
          cb();
        }

        if (type === 'team') {
          store.dispatch(getUserTeams(localStorage.getItem('token')));
          cb();
        }
      })
      .catch((error) => {
        store.dispatch({ type: SET_ERRORS, payload: error });
      });
  };
  return (
    <div className="modal-bg">
      <div className="modal-body">
        <h5>
          Are you sure you want to delete <span>{item.name}</span>?
        </h5>
        <div className="modal-btn-container">
          <button
            onClick={() => {
              deleteItem(type, item._id, teamId, closeModal);
            }}
          >
            Yes
          </button>
          <button onClick={closeModal}>No</button>
        </div>
        {/* <button className="modal-close" onClick={closeModal}>
          <i className="fas fa-times"></i>
        </button> */}
      </div>
    </div>
  );
}

export default DeleteModal;
