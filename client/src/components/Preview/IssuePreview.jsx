import React, { useEffect, useState } from "react";

//Axios
import axios from "axios";

//Redux
import { connect } from "react-redux";

//SVG
import TrashSVG from "../SVG/TrashSVG";
import TickSVG from "../SVG/TickSVG";
import ConstructionConeSVG from "../SVG/ConstructionConeSVG";

//React Router DOM
import { withRouter } from "react-router-dom";

//Components
import Modal from "../Modal/Modal";

const IssuePreview = (props) => {
  const { issue, index, labels, pathname } = props;

  const modalTypes = {
    "Delete Modal": "Delete Modal",
  };
  const [issueLabels, setIssueLabels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [numLabels, setNumLabels] = useState(2);
  const [modalType, setModalType] = useState("");

  const calculateNumberOfLabels = () => {
    if (window.innerWidth <= 500) setNumLabels(0);
    else if (window.innerWidth <= 768) setNumLabels(1);
    else setNumLabels(2);
  };

  window.addEventListener("resize", calculateNumberOfLabels);

  useEffect(() => {
    var newLabels = [];
    if (labels) {
      if (labels.length > 0) {
        labels.forEach((label) => {
          if (issue.labels.includes(label._id)) {
            newLabels.push(label);
          }
        });
      }
    }

    calculateNumberOfLabels();
    setIssueLabels(newLabels);
  }, []);

  useEffect(() => {
    if (showModal) {
      window.addEventListener("keyup", (e) => {
        if (e.key === "Escape") {
          setShowModal(false);
        }
      });
    }
  }, [showModal]);

  const gotoIssue = () => {
    props.history.push(
      `${
        pathname.toString().indexOf("team") > -1
          ? "/team/project/"
          : "/project/"
      }${issue.project}/issue/${issue._id}`
    );
  };

  const deleteIssue = () => {
    axios
      .delete(`/api/issue/${issue._id}`)
      .then((res) => {
        if (res && res.data) {
          props.getProjectData();
          props.setMessages(res.data);
        }
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
    <div className="issue-preview__wrapper" onClick={() => gotoIssue()}>
      {renderModal()}
      <div className="issue-preview">
        <div className="issue-preview__first-div">
          <div className="issue-preview__name">{issue.name}</div>

          <div className="issue-preview__labels-container">
            {issue["labels"] &&
              issueLabels.length > 0 &&
              issueLabels.map((label, index) => {
                if (index > numLabels) {
                  return null;
                } else {
                  return (
                    <div
                      style={{
                        background: `${label.backgroundColor}`,
                        color: `${label.fontColor}`,
                        textAlign: "center",
                      }}
                      className="issue-preview__label"
                      id={`issue-preview__label-${index}`}
                      key={index}
                    >
                      {label.name}
                    </div>
                  );
                }
              })}
          </div>
          <div className="issue-preview__actions-container">
            {issue.status && (
              <>
                {issue.status.name === "New Issue" ? (
                  <span
                    className="issue-preview__status issue-preview__status--new-issue"
                    id={`issue-preview__status-${index}`}
                  >
                    <span>!</span>
                  </span>
                ) : issue.status.name === "Work In Progress" ? (
                  <span
                    className="issue-preview__status issue-preview__status--work-in-progress"
                    id={`issue-preview__status-${index}`}
                  >
                    <ConstructionConeSVG />
                  </span>
                ) : (
                  <span
                    className="issue-preview__status issue-preview__status--finished"
                    id={`issue-preview__status-${index}`}
                  >
                    <TickSVG />
                  </span>
                )}
              </>
            )}
            <div
              className="issue-preview__delete"
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
      </div>
    </div>
  );
};
export default connect()(withRouter(IssuePreview));
