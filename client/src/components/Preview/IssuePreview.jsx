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

//SVG
import TrashSVG from "../SVG/TrashSVG";

//React Router DOM
import { Link, withRouter } from "react-router-dom";

const IssuePreview = (props) => {
  const { issue, index, labels, pathname } = props;

  const [issueLabels, setIssueLabels] = useState([]);

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
    setIssueLabels(newLabels);
  }, []);

  const deleteModal = (e) => {
    e.stopPropagation();
    props.setDeleteItem(issue);
    props.setItemType("issue");
    props.setCurrentLocation(props.history.location.pathname.split("/"));
    props.showModal();
  };

  const gotoIssue = () => {
    props.history.push(
      `${
        pathname.toString().indexOf("team") > -1
          ? "/team/project/"
          : "/project/"
      }${issue.project}/issue/${issue._id}`
    );
  };

  return (
    <div className="issue-preview__wrapper" onClick={() => gotoIssue()}>
      <div className="issue-preview">
        <div className="issue-preview__first-div">
          <div className="issue-preview__name">{issue.name}</div>

          {issue["labels"] &&
            issueLabels.length > 0 &&
            issueLabels.map((label, index) => {
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
          {issue.status.name === "New Issue" ? (
            <span
              className="issue-preview__status"
              id={`issue-preview__status-${index}`}
            >
              <i
                style={{ color: `${issue.status.color}` }}
                className="fas fa-exclamation"
              ></i>
            </span>
          ) : issue.status.name === "Work In Progress" ? (
            <span
              className="issue-preview__status"
              id={`issue-preview__status-${index}`}
            >
              <i
                style={{ color: `${issue.status.color}` }}
                className="fas fa-truck-loading"
              ></i>
            </span>
          ) : (
            <span
              className="issue-preview__status"
              id={`issue-preview__status-${index}`}
            >
              <i
                style={{ color: `${issue.status.color}` }}
                className="fas fa-check"
              ></i>
            </span>
          )}
          <div
            className="issue-preview__delete"
            onClick={(e) => {
              deleteModal(e);
            }}
          >
            <TrashSVG />
          </div>
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
