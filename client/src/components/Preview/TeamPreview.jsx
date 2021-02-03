import React, { useEffect, useState } from "react";

//Axios
import axios from "axios";

//React Router DOM
import { Link, withRouter } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//Actions
import { setErrors, setMessages } from "../../redux/actions/userActions";

//SVG
import TrashSVG from "../SVG/TrashSVG";
import LeaveFillSVG from "../SVG/LeaveFillSVG";

//Components
import Modal from "../Modal/Modal";

const TeamPreview = (props) => {
  const { team } = props;

  const modalTypes = {
    "Delete Modal": "Delete Modal",
    "Leave Modal": "Leave Modal",
  };

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const deleteTeam = () => {
    axios
      .delete(`/api/team/${team._id}`)
      .then((res) => {
        if (res && res.data) props.setMessages(res.data);
        props.getTeams();
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          setErrors(error);
        }
      });
  };

  const leaveTeam = () => {
    axios
      .put(`/api/leave/team/${team._id}`, null)
      .then((res) => {
        if (res && res.data) props.setMessages(res.data);
        props.getTeams();
        props.history.replace("/team");
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          props.setErrors(error);
        }
      });
  };

  const gotoTeam = () => {
    if (props.currentCategory === props.categories.Teams)
      props.history.push(`/team/${team._id}`);
    else if (props.currentCategory === props.categories.Chat) {
      props.history.push(`/team/chat/${team._id}`);
      props.setCurrentTeam(`${team._id}`);
    }
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
                  Are you sure you want to delete{" "}
                  <span>{team.name && team.name}</span>?
                </div>
                <div className="modal__delete-modal-body__action-container">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTeam();
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
        case modalTypes["Leave Modal"]:
          return (
            <Modal setShowModal={setShowModal} showModal={showModal}>
              <div
                className="modal__delete-modal-body"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="modal__delete-modal-body__message">
                  Are you sure you want to leave <span>{team.name}</span>?
                </div>
                <div className="modal__delete-modal-body__action-container">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      leaveTeam();
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
    <div className={`team-preview ${props.currentTeam && "selected"}`}>
      {renderModal()}
      <div
        className="team-preview__container"
        onClick={() => {
          gotoTeam();
        }}
      >
        {team.name && <span>{team.name}</span>}
        {team.createdBy &&
        props.user &&
        props.user._id &&
        team.createdBy.toString() === props.user._id.toString() ? (
          <div
            className="team-preview__delete"
            onClick={(e) => {
              e.stopPropagation();
              setModalType(modalTypes["Delete Modal"]);
              setShowModal(true);
            }}
          >
            <TrashSVG />
          </div>
        ) : (
          <div
            className="team-preview__delete"
            onClick={(e) => {
              e.stopPropagation();
              setModalType(modalTypes["Leave Modal"]);
              setShowModal(true);
            }}
          >
            <LeaveFillSVG />
          </div>
        )}
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  setErrors,
  setMessages,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TeamPreview));
