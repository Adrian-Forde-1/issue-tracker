import React, { useEffect, useState } from "react";

//Redux
import { connect } from "react-redux";

//Actions
import {
  showModal,
  setDeleteItem,
  setItemType,
  setCurrentLocation,
} from "../../redux/actions/modalActions";

//React Router DOM
import { Link, withRouter } from "react-router-dom";

const IssuePreview = (props) => {
  const { bug, index, labels, projectId } = props;

  const [bugLabels, setBugLabels] = useState([]);

  useEffect(() => {
    // console.log(bug.labels);
    var newLabels = [];
    if (labels) {
      if (labels.length > 0) {
        labels.forEach((label) => {
          if (bug.labels.includes(label._id)) {
            newLabels.push(label);
          }
        });
      }
    }
    setBugLabels(newLabels);
  }, []);

  const deleteModal = (e) => {
    e.stopPropagation();
    props.setDeleteItem(bug);
    props.setItemType("bug");
    props.setCurrentLocation(props.history.location.pathname.split("/"));
    props.showModal();
  };

  const gotoBug = () => {
    props.history.push(`/project/${bug.project}/bug/${bug._id}`);
  };

  return (
    <div className="issue-preview__wrapper" onClick={() => gotoBug()}>
      <div className="issue-preview">
        <div className="issue-preview__first-div">
          <div className="issue-preview__name">{bug.name}</div>

          {bug["labels"] &&
            bugLabels.length > 0 &&
            bugLabels.map((label, index) => {
              if (index > 2) {
                return null;
              } else {
                return (
                  <div
                    style={{
                      background: `${label.color}`,
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
          {bug.status.name === "New Bug" ? (
            <span
              className="issue-preview__status"
              id={`issue-preview__status-${index}`}
            >
              <i
                style={{ color: `${bug.status.color}` }}
                className="fas fa-exclamation"
              ></i>
            </span>
          ) : bug.status.name === "Work In Progress" ? (
            <span
              className="issue-preview__status"
              id={`issue-preview__status-${index}`}
            >
              <i
                style={{ color: `${bug.status.color}` }}
                className="fas fa-truck-loading"
              ></i>
            </span>
          ) : (
            <span
              className="issue-preview__status"
              id={`issue-preview__status-${index}`}
            >
              <i
                style={{ color: `${bug.status.color}` }}
                className="fas fa-check"
              ></i>
            </span>
          )}
        </div>
        <div className="issue-preview__second-div">
          <p className="issue-preview__description">{bug.description}</p>
          <i
            className="far fa-trash-alt"
            onClick={(e) => {
              deleteModal(e);
            }}
          ></i>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  showModal,
  setDeleteItem,
  setItemType,
  setCurrentLocation,
};

export default connect(null, mapDispatchToProps)(withRouter(IssuePreview));
