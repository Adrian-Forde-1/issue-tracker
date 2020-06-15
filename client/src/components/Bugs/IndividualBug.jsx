import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

//Tostify
import { toast } from 'react-toastify';

//React Router DOM
import { Link } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//Actions
import { setErrors, clearErrors } from '../../redux/actions/userActions';
import {
  showModal,
  setDeleteItem,
  setItemType,
  setCurrentLocation,
} from '../../redux/actions/modalActions';

//Components
import SideNav from '../Navigation/SideNav';
import ProjectsTeamsHamburger from '../Navigation/ProjectsTeamsHamburger';

function IndividualBug(props) {
  const [bug, setBug] = useState({});
  const [comment, setComment] = useState('');
  const [bugLabels, setBugLabels] = useState([]);

  useEffect(() => {
    const bugId = props.match.params.bugId;
    axios
      .get(`/api/bug/${bugId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        setBug(response.data);

        var newLabels = [];
        response.data.project.labels.forEach((label) => {
          if (response.data.labels.includes(label._id)) {
            newLabels.push(label);
          }
        });
        setBugLabels(newLabels);
      })
      .catch((error) => {
        props.setErrors(error);
        props.history.goBack();
      });
  }, []);

  const deleteModal = () => {
    props.setDeleteItem(bug);
    props.setItemType('bug');
    props.setCurrentLocation(props.history.location.pathname.split('/'));
    props.showModal();
  };

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
        `/api/bug/${bug._id}/status`,
        { bug: newStatus },
        { headers: { Authorization: localStorage.getItem('token') } }
      )
      .catch((error) => {
        props.setErrors(error);
        props.history.goBack();
      });
  };

  return (
    <div className="individual-container">
      <SideNav />
      <div>
        {Object.keys(bug).length > 0 && (
          <div className="containers p-t-20">
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
              : props.errors['comment'] &&
                !toast.isActive('commenttoast') &&
                toast(props.errors.comment, {
                  toastId: 'commenttoast',
                  type: 'error',
                  position: toast.POSITION.TOP_CENTER,
                  autoClose: 2000,
                  onClose: () => {
                    props.clearErrors();
                  },
                })}
            <h3 className="bug-title">
              <span>{bug.name}</span>{' '}
              {bug.createdBy._id.toString() === props.user._id.toString() && (
                <div>
                  <Link to={`/project/${bug.project._id}/bug/${bug._id}/edit`}>
                    <i className="far fa-edit"></i>
                  </Link>
                  <i className="far fa-trash-alt" onClick={deleteModal}></i>
                </div>
              )}
            </h3>
            <div className="individual-bug-label-container">
              {bugLabels.length > 0 &&
                bugLabels.map((label, index) => (
                  <span
                    className="individual-bug-label"
                    style={{ background: `${label.color}` }}
                    key={index}
                  >
                    {label.name}
                  </span>
                ))}
            </div>
            <br />
            <div className="bug-creation-date">
              Created By
              <span> {bug.createdBy.username} </span>
              <span> &middot; </span>
              {moment(bug.createdAt).fromNow()}
            </div>
            <p className="individual-bug-description">{bug.description}</p>

            {bug['assignees'] && bug.assignees.length > 0 && (
              <div className="bug-creation-date bug-assignees">
                <span className="mb-2">Assigned to:</span>
                <br />
                <ul className="list-group">
                  {bug.assignees.map((assignee) => (
                    <li className="list-group-item" key={assignee._id}>
                      {assignee.username}
                    </li>
                  ))}
                </ul>
              </div>
            )}

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

            <h2 className="bug-comments-title">Comments</h2>
            {/* <Link to={`/bug/${bug._id}/comment/new`} className="add-comment">
            <i className="fas fa-plus"></i>
          </Link> */}
            <div className="add-comment-container">
              <textarea
                name="newComment"
                id="new-comment"
                cols="30"
                rows="10"
                maxLength="500"
                value={comment}
                placeholder="New Comment"
                className="new-comment"
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              ></textarea>
              <button
                className="submit-comment"
                onClick={() => {
                  const newComment = {
                    comment: comment,
                    bug: bug._id,
                  };

                  const username = props.user.username;
                  axios
                    .post(
                      '/api/comment',
                      {
                        comment: newComment,
                        bugId: bug._id,
                        username: username,
                      },
                      {
                        headers: {
                          Authorization: localStorage.getItem('token'),
                        },
                      }
                    )
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
                          setComment('');
                        })
                        .catch((error) => {
                          props.setErrors(error);
                          props.history.goBack();
                        });
                    })
                    .catch((error) => {
                      props.setErrors(error);
                      props.history.goBack();
                    });
                }}
              >
                Comment
              </button>
            </div>
            {bug.comments &&
              bug.comments.length > 0 &&
              bug.comments.map((comment) => (
                <div className="comment-container" key={comment._id}>
                  <div className="bug-comment">
                    <p className="comment-date">
                      <span>{comment.createdBy}</span> &middot;
                      <span> {moment(comment.createdAt).fromNow()}</span>
                    </p>
                    <p>{comment.comment}</p>
                  </div>
                  <i
                    className="far fa-trash-alt"
                    onClick={() => {
                      axios
                        .delete(`/api/comment/${comment._id}`, {
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
                              props.setErrors(error);
                              props.history.goBack();
                            });
                        })
                        .catch((error) => {
                          props.setErrors(error);
                          props.history.goBack();
                        });
                    }}
                  ></i>
                </div>
              ))}
          </div>
        )}
      </div>
      <ProjectsTeamsHamburger />
    </div>
  );
}

const mapDispatchToProps = {
  setErrors,
  clearErrors,
  showModal,
  setDeleteItem,
  setItemType,
  setCurrentLocation,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  projects: state.projects.projects,
  errors: state.user.errors,
});

export default connect(mapStateToProps, mapDispatchToProps)(IndividualBug);
