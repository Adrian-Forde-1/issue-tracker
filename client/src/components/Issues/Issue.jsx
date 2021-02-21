import React, { useEffect, useState } from "react";

//Axios
import axios from "axios";

//Tippy
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";

//Moment
import moment from "moment";

import ReactMarkdown from "react-markdown";

//React Router DOM
import { Link } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//SVG
import TrashSVG from "../SVG/TrashSVG";
import EditSVG from "../SVG/EditSVG";
import CaretDownNoFillSVG from "../SVG/CaretDownNoFillSVG";
import TickSVG from "../SVG/TickSVG";
import ConstructionConeSVG from "../SVG/ConstructionConeSVG";
import HistorySVG from "../SVG/HistorySVG";

//Actions
import { setErrors, setMessages } from "../../redux/actions/userActions";

//Components
import Modal from "../Modal/Modal";
import Spinner from "../Misc/Spinner/Spinner";

const Issue = (props) => {
  const modalTypes = {
    "Delete Modal": "Delete Modal",
  };
  const [issue, setIssue] = useState({});
  const [comment, setComment] = useState("");
  const [issueLabels, setIssueLabels] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getIssue();
  }, []);

  const getIssue = () => {
    const issueId = props.match.params.issueId;
    setIsLoading(true);
    axios
      .get(`/api/issue/${issueId}`)
      .then((response) => {
        if (response && response.data) {
          if (
            (response.data.project.team !== null &&
              props.location.pathname.toString().indexOf("team") === -1) ||
            (response.data.project.team === null &&
              props.location.pathname.toString().indexOf("team") > -1)
          ) {
            props.history.goBack();
          } else {
            if (props.location.pathname.toString().indexOf("team") > -1)
              props.setCurrentTeam(response.data.project.team);
            else props.setCurrentProject(response.data.project._id);

            var newLabels = [];
            response.data.project.labels.forEach((label) => {
              if (response.data.labels.includes(label._id)) {
                newLabels.push(label);
              }
            });
            setIssueLabels(newLabels);

            setIssue(response.data);
          }
        } else {
          props.setErrors(["Something went wrong"]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (err && err.response && err.response.data) {
          props.setErrors(err);
          props.history.goBack();
        }
        if (
          err &&
          err.response &&
          err.response.status &&
          err.response.status === 404
        ) {
          props.history.replace("/project/404");
        }
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (Object.keys(issue).length > 0 && issue.status) {
      if (issue.status.name === "New Issue")
        document.querySelector("#new-issue").classList.add("selected");
      if (issue.status.name === "Work In Progress")
        document.querySelector("#work-in-progress").classList.add("selected");
      if (issue.status.name === "Completed")
        document.querySelector("#completed").classList.add("selected");
    }
  }, [issue]);

  const updateIssue = (e, status) => {
    const elements = document.querySelectorAll(".issue__status");
    elements.forEach((element) => {
      if (element.classList.contains("selected")) {
        element.classList.remove("selected");
      }
    });

    e.target.classList.add("selected");

    const newStatus = {};
    if (status === "New Issue") {
      newStatus.name = "New Issue";
      newStatus.color = "red";
    }
    if (status === "Work In Progress") {
      newStatus.name = "Work In Progress";
      newStatus.color = "orange";
    }
    if (status === "Completed") {
      newStatus.name = "Completed";
      newStatus.color = "#1e90ff";
    }

    axios
      .put(`/api/issue/${issue._id}/status`, {
        issue: newStatus,
        username: props.user.username,
      })
      .then(() => {
        getIssue();
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          props.setErrors(error);
          props.history.goBack();
        }
      });
  };

  const deleteIssue = () => {
    axios
      .delete(`/api/issue/${issue._id}`)
      .then((res) => {
        if (res && res.data) {
          props.setMessages(res.data);
          props.history.goBack();
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          props.setErrors(error);
          props.history.goBack();
        }
      });
  };

  const addComment = () => {
    const newComment = {
      comment: comment,
      issue: issue._id,
    };

    const username = props.user.username;
    axios
      .post("/api/comment", {
        comment: newComment,
        issueId: issue._id,
        username: username,
      })
      .then(() => {
        const issueId = props.match.params.issueId;
        axios
          .get(`/api/issue/${issueId}`)
          .then((response) => {
            setIssue(response.data);
            setComment("");
          })
          .catch((error) => {
            if (error && error.response && error.response.data) {
              props.setErrors(error);
              props.history.goBack();
            }
          });
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          props.setErrors(error);
          props.history.goBack();
        }
      });
  };

  const renderModal = () => {
    if (showModal) {
      switch (modalType) {
        case modalTypes["Delete Modal"]:
          return (
            <Modal setShowModal={setShowModal} showModal={showModal}>
              <div
                className="modal__delete-modal-body"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="modal__delete-modal-body__message">
                  Are you sure you want to delete <span>{issue.name}</span>?
                </div>
                <div className="modal__delete-modal-body__action-container">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteIssue();
                    }}
                  >
                    <span>Yes</span>
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowModal(false);
                    }}
                  >
                    <span>No</span>
                  </div>
                </div>
                <div
                  className="modal__close"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(false);
                  }}
                >
                  &times;
                </div>
              </div>
            </Modal>
          );
      }
    }
  };

  if (Object.keys(issue).length > 0) {
    return (
      <div className="issue__wrapper">
        {renderModal()}
        {Object.keys(issue).length > 0 && (
          <React.Fragment>
            <div className="issue__header">
              <div className="issue__name">{issue.name}</div>
              <div className="issue__action-buttons-container">
                <div>
                  <Link
                    to={`${
                      issue.project.team !== null
                        ? "/team/project/"
                        : "/project/"
                    }issue/${issue._id}/history`}
                  >
                    <Tooltip title="History" position="bottom" size="small">
                      <HistorySVG />
                    </Tooltip>
                  </Link>
                </div>
                <div>
                  <Link
                    to={`${
                      issue.project.team !== null
                        ? "/team/project/"
                        : "/project/"
                    }${issue.project._id}/issue/${issue._id}/edit`}
                  >
                    <Tooltip title="Edit Issue" position="bottom" size="small">
                      <EditSVG />
                    </Tooltip>
                  </Link>
                </div>

                <div
                  onClick={() => {
                    setModalType(modalTypes["Delete Modal"]);
                    setShowModal(true);
                  }}
                >
                  <Tooltip title="Delete Issue" position="bottom" size="small">
                    <TrashSVG />
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="issue__creation-date">
              Created By
              <span> {issue.createdBy.username} </span>
              <span> &middot; </span>
              {new Date(issue.createdAt).toDateString()}
            </div>
            {issue.completedOn !== null && (
              <div
                className="issue__creation-date"
                style={{ marginTop: "-10px" }}
              >
                Completed On
                <span> &middot; </span>
                {new Date(issue.completedOn).toDateString()}
              </div>
            )}
            <div className="issue__description">
              <div
                className="issue__description-name"
                onClick={() => setShowDescription(!showDescription)}
              >
                <span>Description</span> <CaretDownNoFillSVG />
              </div>
              <div
                className={`issue__description-dropdown ${
                  showDescription && "visible"
                }`}
              >
                <ReactMarkdown>{issue.description}</ReactMarkdown>
              </div>
            </div>
            {issueLabels.length > 0 && (
              <div className="issue__label-container">
                {issueLabels.map((label, index) => (
                  <span
                    className="issue__label"
                    style={{
                      background: `${label.backgroundColor}`,
                      color: `${label.fontColor}`,
                    }}
                    key={index}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            )}
            {issue["assignees"] && issue.assignees.length > 0 && (
              <div className="issue-creation-date issue__assignees">
                <span className="mb-2">Assigned to:</span>
                <ul className="list-group">
                  {issue.assignees.map((assignee) => (
                    <li className="list-group-item" key={assignee._id}>
                      <div className="issue__assignee-img-container">
                        <img
                          src={assignee.image}
                          alt="Assignee profile picture"
                        />
                      </div>
                      <span>{assignee.username}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div
              className="issue__status-container"
              id="issue__status-container"
            >
              <Tooltip title="New Issue" position="bottom" size="small">
                <div
                  id="new-issue"
                  className="issue__status"
                  onClick={(e) => {
                    updateIssue(e, "New Issue");
                  }}
                >
                  <span>!</span>
                </div>
              </Tooltip>

              <Tooltip title="Work In Progress" position="bottom" size="small">
                <div
                  id="work-in-progress"
                  className="issue__status"
                  onClick={(e) => {
                    updateIssue(e, "Work In Progress");
                  }}
                >
                  <ConstructionConeSVG />
                </div>
              </Tooltip>
              <Tooltip title="Completed" position="bottom" size="small">
                <div
                  id="completed"
                  className="issue__status"
                  onClick={(e) => {
                    updateIssue(e, "Completed");
                  }}
                >
                  <TickSVG />
                </div>
              </Tooltip>
            </div>

            <h2 className="issue__comments-title">Comments</h2>
            {/* <Link to={`/issue/${issue._id}/comment/new`} className="add-comment">
              <i className="fas fa-plus"></i>
            </Link> */}
            <div className="issue__new-comment-container">
              <textarea
                name="newComment"
                id="new-comment"
                cols="30"
                rows="10"
                maxLength="500"
                value={comment}
                placeholder="New Comment"
                className="issue__comment-textarea"
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              ></textarea>
              <button
                className="submit-comment"
                onClick={() => {
                  addComment();
                }}
              >
                Comment
              </button>
            </div>
            {issue.comments &&
              issue.comments.length > 0 &&
              issue.comments.map((comment) => (
                <div className="issue__comment-container" key={comment._id}>
                  <div className="issue__comment">
                    <p className="issue__comment-date">
                      <span>{comment.createdBy}</span> &middot;
                      <span> {moment(comment.createdAt).fromNow()}</span>
                    </p>
                    <p>{comment.comment}</p>
                  </div>
                  <i
                    className="far fa-trash-alt"
                    onClick={() => {
                      axios
                        .delete(`/api/comment/${comment._id}`)
                        .then(() => {
                          const issueId = props.match.params.issueId;
                          axios
                            .get(`/api/issue/${issueId}`)
                            .then((response) => {
                              setIssue(response.data);
                            })
                            .catch((error) => {
                              if (
                                error &&
                                error.response &&
                                error.response.data
                              ) {
                                props.setErrors(error);
                                props.history.goBack();
                              }
                            });
                        })
                        .catch((error) => {
                          if (error && error.response && error.response.data) {
                            props.setErrors(error);
                            props.history.goBack();
                          }
                        });
                    }}
                  ></i>
                </div>
              ))}
          </React.Fragment>
        )}
      </div>
    );
  } else if (isLoading) return <Spinner />;
  else return null;
};

const mapDispatchToProps = {
  setErrors,
  setMessages,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  projects: state.projects.projects,
  errors: state.user.errors,
});

export default connect(mapStateToProps, mapDispatchToProps)(Issue);
