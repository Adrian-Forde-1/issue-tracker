import React from 'react';
import axios from 'axios';

//Redux
import store from '../redux/store';

//Actions
import { getUserProjects } from '../redux/actions/projectActions';
import { getUserGroups } from '../redux/actions/groupActions';
import { SET_ERRORS } from '../redux/actions/types';

function DeleteModal(props) {
  const { item, type, history } = props;

  const closeModal = () => {
    const element = document.querySelector('.modal-element');
    document.querySelector('#modal-root').removeChild(element);
  };

  const deleteItem = (type, id, history, cb) => {
    axios
      .delete(`/api/${type}/${id}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then(() => {
        if (type === 'project') {
          store.dispatch(getUserProjects(localStorage.getItem('token')));
          cb();
          if (item['group'] !== null) {
            if (history !== null) history.goBack();
          } else if (history !== null) history.goBack();
        }
        if (type === 'bug') {
          store.dispatch(getUserProjects(localStorage.getItem('token')));
          cb();
          if (history !== null) history.goBack();
        }

        if (type === 'group') {
          store.dispatch(getUserGroups(localStorage.getItem('token')));
          cb();
          if (history !== null) history.goBack();
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
              deleteItem(type, item._id, history, closeModal);
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
