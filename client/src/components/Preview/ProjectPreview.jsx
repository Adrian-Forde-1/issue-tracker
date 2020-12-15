import React, { useState } from "react";
import axios from "axios";

//React Router DOM
import { withRouter, Link } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//SVG
import TrashSVG from "../SVG/TrashSVG";

//Actions
import { setErrors, setMessages } from "../../redux/actions/userActions";

//Components
import Modal from "../Modal/Modal";

function ProjectPreview(props) {
  const { project, getProjects, setMessages, setErrors } = props;

  const modalTypes = {
    "Delete Modal": "Delete Modal",
  };

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const deleteProject = () => {
    axios
      .delete(`/api/project/${project._id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        if (res && res.data) {
          getProjects();
          setMessages(res.data);
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          setErrors(error);
        }
      });
  };

  const renderModal = () => {
    if (showModal) {
      switch (modalType) {
        case modalTypes["Delete Modal"]:
          return (
            <Modal setShowModal={setShowModal}>
              <div className="modal__delete-modal-body">
                <div className="modal__delete-modal-body__message">
                  Are you sure you want to delete <span>{project.name}</span>?
                </div>
                <div className="modal__delete-modal-body__action-container">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject();
                      setShowModal(false);
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

  return (
    <div className="project-preview">
      {renderModal()}
      <Link
        to={`${props.teamProject ? "/team/project/" : "/project/"}${
          project._id
        }`}
      >
        <span>{project.name}</span>
      </Link>

      <i
        className={`fas fa-archive archive-btn ${props.extraIconClass}`}
        onClick={() => {
          if (project.archived === false) {
            axios
              .put(`/api/project/${project._id}/archive/add`, null, {
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
              })
              .then(() => {
                if (project.team) {
                  props.setTeamUpdated(true);
                } else {
                  axios
                    .get(`/api/project/${project._id}`, {
                      headers: {
                        Authorization: localStorage.getItem("token"),
                      },
                    })
                    .then(() => {
                      props.getUserProjects(localStorage.getItem("token"));
                    })
                    .catch((error) => {
                      props.setErrors(error.response.data);
                      props.history.goBack();
                    });
                }
              })
              .catch((error) => {
                props.setErrors(error.response.data);
                props.history.location("/projects");
              });
          } else {
            axios
              .put(`/api/project/${project._id}/archive/remove`, null, {
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
              })
              .then(() => {
                props.resetProjects();
              })
              .catch((error) => {
                props.setErrors(error);
                props.history.location("/projects/archived");
              });
          }
        }}
      ></i>

      <div
        className="project-preview__delete"
        onClick={(e) => {
          e.stopPropagation();
          setModalType(modalTypes["Delete Modal"]);
          setShowModal(true);
        }}
      >
        <TrashSVG />
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  setErrors,
  setMessages,
};

export default connect(null, mapDispatchToProps)(withRouter(ProjectPreview));
