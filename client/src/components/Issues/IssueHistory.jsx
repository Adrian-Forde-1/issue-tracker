import React, { useEffect, useState } from "react";

//Axiox
import axios from "axios";

//Components
import Spinner from "../Misc/Spinner/Spinner";
import IssueHistoryBlock from "./IssueHistoryBlock.jsx";

const IssueHistory = (props) => {
  const [issue, setIssue] = useState({});
  const [project, setProject] = useState({});
  const [updates, setUpdates] = useState([]);
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

            // var newLabels = [];
            // response.data.project.labels.forEach((label) => {
            //   if (response.data.labels.includes(label._id)) {
            //     newLabels.push(label);
            //   }
            // });
            // setIssueLabels(newLabels);

            setIssue(response.data);
            setProject(response.data.project);
            if (response.data["updates"]) {
              let newUpdates = response.data.updates.reverse();
              setUpdates(newUpdates);
            }
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

  if (Object.keys(issue).length > 0 && updates.length > 0) {
    return (
      <div className="issue-history__wrapper">
        <div className="issue-history__history-header">
          <h1 className="issue-history__issue-name">
            Issue: {issue.name ? issue.name : "-"}
          </h1>
          <h5 className="issue-history__history-heading">History</h5>
        </div>
        <div className="issue-history__history-wrapper">
          {updates &&
            updates.length > 0 &&
            updates.map((update, index) => (
              <IssueHistoryBlock
                key={index}
                date={update.date}
                updatedBy={update.updatedBy}
                updateInfo={update.updateInfo}
                updateType={update.updateType}
                projectLabels={project["labels"]}
                index={index}
              />
            ))}
        </div>
      </div>
    );
  } else if (isLoading) return <Spinner />;
  else
    return (
      <div className="issue-history__no-history">
        <h1>No update history was found</h1>
      </div>
    );
};

export default IssueHistory;
