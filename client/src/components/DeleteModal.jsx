import React from 'react';
import axios from 'axios';

//Redux
import store from '../redux/store';

//Actions
import {
  getUserProjects,
  setProjectUpdated,
} from '../redux/actions/projectActions';
import { getUserGroups } from '../redux/actions/groupActions';
import {
  setCurrentSection,
  setCurrentId,
  clearCurrentSectionAndId,
} from '../redux/actions/userActions';
import { SET_ERRORS } from '../redux/actions/types';

function DeleteModal(props) {
  const { item, type, groupId, idInfo } = props;

  const closeModal = () => {
    const element = document.querySelector('.modal-element');
    document.querySelector('#modal-root').removeChild(element);
  };

  const deleteItem = (type, id, groupId, idInfo, cb) => {
    axios
      .delete(`/api/${type}/${id}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then(() => {
        if (type === 'project') {
          store.dispatch(getUserProjects(localStorage.getItem('token')));
          if (groupId !== null) {
            store.dispatch(clearCurrentSectionAndId());
            store.dispatch(setCurrentSection('group'));
            store.dispatch(setCurrentId(groupId));
            store.dispatch(getUserGroups(localStorage.getItem('token')));
            // axios.get(`/api/group/${groupId}`, {headers: {Authorization: localStorage.getItem('token')}}).then(response => {

            // })
          }
          cb();
        }
        if (type === 'bug') {
          // store.dispatch(getUserProjects(localStorage.getItem('token')));
          sessionStorage.setItem('deleteModalLog', item.project._id);
          store.dispatch(setProjectUpdated(true));
          store.dispatch(setCurrentId(idInfo));
          store.dispatch(setCurrentSection('project'));
          cb();
        }

        if (type === 'group') {
          store.dispatch(getUserGroups(localStorage.getItem('token')));
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
              deleteItem(type, item._id, groupId, idInfo, closeModal);
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
