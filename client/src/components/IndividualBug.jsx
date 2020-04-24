import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

//Tostify
import { toast } from 'react-toastify';

//Components
import DeleteModal from './DeleteModal';
import GoBack from './GoBack';

//React Router DOM
import { withRouter, Link } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//Actions
import { setErrors, clearErrors } from '../redux/actions/userActions';

function IndividualBug(props) {
  const [bug, setBug] = useState({});

  useEffect(() => {
    const bugId = props.match.params.bugId;
    axios
      .get(`/api/bug/${bugId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        setBug(response.data);
      })
      .catch((error) => {
        props.setErrors(error.response.data);
        props.history.goBack();
      });
  }, []);

  useEffect(() => {
    if (Object.keys(bug).length > 0) {
      if (bug.status.name === 'New Bug')
        document.querySelector('#new-bug').classList.add('selected');
      if (bug.status.name === 'Work In Progress')
        document.querySelector('#work-in-progress').classList.add('selected');
      if (bug.status.name === 'Fixed')
        document.querySelector('#fixed').classList.add('selected');
    }
  }, [bug]);

  const updateBug = (e) => {
    const childNodes = e.target.parentNode.childNodes;
    childNodes.forEach((child) => child.classList.remove('selected'));

    e.target.classList.add('selected');

    const newStatus = {};
    if (e.target.innerHTML === 'New Bug') {
      newStatus.name = 'New Bug';
      newStatus.color = 'red';
    }
    if (e.target.innerHTML === 'Work In Progress') {
      newStatus.name = 'Work In Progress';
      newStatus.color = 'orange';
    }
    if (e.target.innerHTML === 'Fixed') {
      newStatus.name = 'Fixed';
      newStatus.color = '#1e90ff';
    }

    axios
      .put(
        `/api/bug/${bug._id}`,
        { bug: newStatus },
        { headers: { Authorization: localStorage.getItem('token') } }
      )
      .catch((error) => {
        props.setErrors(error.response.data);
        props.history.goBack();
      });
  };

  return (
    <div className="individual-bug-container">
      <GoBack />
      {Object.keys(bug).length > 0 && (
        <div className="container">
          {props.errors !== null && props.errors['bug']
            ? !toast.isActive('bugtoast') &&
              toast(props.errors.bug, {
                toastId: 'bugtoast',
                type: 'error',
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                onClose: () => {
                  props.clearErrors();
                },
              })
            : props.errors['note'] &&
              !toast.isActive('notetoast') &&
              toast(props.errors.note, {
                toastId: 'notetoast',
                type: 'error',
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                onClose: () => {
                  props.clearErrors();
                },
              })}
          <h3>
            Bug Name: <span>{bug.name}</span>
          </h3>
          <p className="text-center bug-title">Description</p>
          <p className="individual-bug-description">{bug.description}</p>
          <div className="bug-creation-date">
            <span>Created By </span>
            {bug.createdBy.username}
            <span> On </span>
            {bug.createdAt.slice(0, 10)}
          </div>
          <div
            className="individual-bug-status-container"
            id="individual-bug-status-container"
          >
            <div id="new-bug" onClick={updateBug}>
              New Bug
            </div>
            <div id="work-in-progress" onClick={updateBug}>
              Work In Progress
            </div>
            <div id="fixed" onClick={updateBug}>
              Fixed
            </div>
          </div>

          {bug.createdBy._id.toString() === props.user._id.toString() && (
            <div>
              <button
                className="delete-bug"
                onClick={() => {
                  const element = document.createElement('div');
                  element.classList.add('modal-element');
                  document.querySelector('#modal-root').appendChild(element);
                  ReactDOM.render(
                    <DeleteModal
                      item={bug}
                      type={'bug'}
                      history={props.history}
                    />,
                    element
                  );
                }}
              >
                <i className="far fa-trash-alt"></i>
              </button>
            </div>
          )}

          <h2 className="bug-notes-title">Notes</h2>
          <Link to={`/bug/${bug._id}/note/new`} className="add-note">
            <i className="fas fa-plus"></i>
          </Link>
          {bug.notes &&
            bug.notes.length > 0 &&
            bug.notes.map((note) => (
              <div className="note-container" key={note._id}>
                <div
                  className="bug-note"
                  onClick={(e) => {
                    e.target.classList.toggle('opened');
                  }}
                >
                  <p>{note.note}</p>
                  <p className="note-date">
                    Added by <span>{note.createdBy}</span> on{' '}
                    <span>{note.createdAt.slice(0, 10)}</span>
                  </p>
                </div>
                <i
                  className="far fa-trash-alt"
                  onClick={() => {
                    axios
                      .delete(`/api/note/${note._id}`, {
                        headers: {
                          Authorization: localStorage.getItem('token'),
                        },
                      })
                      .then(() => {
                        const bugId = props.match.params.bugId;
                        axios
                          .get(`/api/bug/${bugId}`, {
                            headers: {
                              Authorization: localStorage.getItem('token'),
                            },
                          })
                          .then((response) => {
                            setBug(response.data);
                          })
                          .catch((error) => {
                            // console.log(error.response.data);
                            props.setErrors(error.response.data);
                            props.history.goBack();
                          });
                      })
                      .catch((error) => {
                        props.setErrors(error.response.data);
                        props.history.goBack();
                      });
                  }}
                ></i>
              </div>
            ))}
          <div className="new-notes"></div>
        </div>
      )}
    </div>
  );
}

const mapDispatchToProps = {
  setErrors,
  clearErrors,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  projects: state.projects.projects,
  errors: state.user.errors,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(IndividualBug));
