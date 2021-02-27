import React, { useState } from "react";
import axios from "axios";

//React Router DOM
import { withRouter, Link } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//SVG
import TrashSVG from "../SVG/TrashSVG";
import ArchiveSVG from "../SVG/ArchiveSVG";
import UnarchiveSVG from "../SVG/UnarchiveSVG";

//Actions
import { setErrors, setMessages } from "../../redux/actions/userActions";

//Components
import Modal from "../Modal/Modal";

function ProjectPreview(props) {
  const {
    project,
    getTeam,
    setMessages,
    setErrors,
    small = false,
    selected = false,
  } = props;

  const modalTypes = {
    "Delete Modal": "Delete Modal",
  };

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const deleteProject = () => {
    axios
      .delete(`/api/project/${project._id}`)
      .then((res) => {
        if (res && res.data) {
          getTeam();
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
            <Modal setShowModal={setShowModal} showModal={showModal}>
              <div
                className="modal__delete-modal-body"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
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

  const gotoProject = () => {
    props.history.push(
      `${props.teamProject ? "/team/project/" : "/project/"}${project._id}`
    );
  };

  const manageArchive = () => {
    if (project.archived === false) {
      axios
        .put(`/api/project/${project._id}/archive/add`, null)
        .then(() => {
          if (project.team) {
            props.setTeamUpdated(true);
          } else {
            axios
              .get(`/api/project/${project._id}`)
              .then(() => {
                props.getUserProjects(localStorage.getItem("token"));
              })
              .catch((err) => {
                if (err && err.response && err.response.data) {
                  props.setErrors(err);
                  props.history.goBack();
                }
              });
          }
        })
        .catch((err) => {
          if (err && err.response && err.response.data) {
            props.setErrors(err);
            props.history.location("/project");
          }
        });
    } else {
      axios
        .put(`/api/project/${project._id}/archive/remove`, null)
        .then(() => {
          props.resetProjects();
        })
        .catch((error) => {
          props.setErrors(error);
          props.history.location("/project/archived");
        });
    }
  };

  return (
    <div className={`project-preview ${selected && "selected"}`}>
      {renderModal()}
      <div
        className="project-preview__container"
        onClick={() => {
          gotoProject();
        }}
      >
        <span className={`${small === true && "project-preview__small-name"}`}>
          {project.name}
        </span>
        {/* {small === false && (
          <div
            className="project-preview__archive-btn"
            onClick={() => {
              manageArchive();
            }}
          >
            {project.archived ? <UnarchiveSVG /> : <ArchiveSVG />}
          </div>
        )} */}

        <div
          className={`project-preview__delete ${
            small && "project-preview__delete--wide"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setModalType(modalTypes["Delete Modal"]);
            setShowModal(true);
          }}
        >
          <TrashSVG />
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  setErrors,
  setMessages,
};

export default connect(null, mapDispatchToProps)(withRouter(ProjectPreview));
