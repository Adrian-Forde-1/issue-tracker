import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

//Axios
import axios from "axios";

//Tippy
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";

//Redux
import { connect } from "react-redux";

//Actions
import { setErrors, setMessages } from "../../redux/actions/userActions";

//SVG
import CaretDownNoFillSVG from "../SVG/CaretDownNoFillSVG";
import PreviewSVG from "../SVG/PreviewSVG";
import InfoSVG from "../SVG/InfoSVG";

//Components
import Spinner from "../Misc/Spinner/Spinner";

const EditIssue = (props) => {
  const [issue, setIssue] = useState({});
  const [members, setMembers] = useState([]);
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
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

            setIssue(response.data);

            if (response.data.assignees) {
              var newAssignedMembers = [];
              response.data.assignees.forEach((assignee) => {
                newAssignedMembers.push(assignee._id.toString());
              });

              setAssignedMembers(newAssignedMembers);
            }

            if (response.data.project && response.data.project.team !== null) {
              axios
                .get(`/api/team/${response.data.project.team}`)
                .then((response) => {
                  if (response && response.data) {
                    setMembers(response.data.users);
                  } else {
                    props.setErrors(["Something went wrong"]);
                  }
                })
                .catch((err) => {
                  if (err && err.response && err.response.data) {
                    props.setErrors(err);
                    props.history.goBack();
                  }
                });
            } else {
              props.setErrors(["Something went wrong"]);
            }
          }
        } else {
          props.setErrors(["Something went wrong"]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.status &&
          err.response.status !== 404
        ) {
          props.setErrors(err);
          props.history.goBack();
        }
        if (err && err.response)
          console.log("Status code: ", err.response.status);
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

  const handleLabelChange = (e) => {
    if (e.target.checked) {
      const newIssue = { ...issue };
      const newLabels = [...newIssue.labels, e.target.value];

      newIssue.labels = newLabels;
      setIssue(newIssue);
    } else {
      const newIssue = { ...issue };
      const newLabels = newIssue.labels.filter(
        (label) => label.toString() !== e.target.value.toString()
      );
      newIssue.labels = newLabels;
      setIssue(newIssue);
    }
  };

  const handleMemberChange = (e) => {
    if (e.target.checked) {
      e.target.checked = true;
      const newMembers = [...assignedMembers, e.target.value];
      setAssignedMembers(newMembers);
    } else {
      e.target.checked = false;
      const newMembers = assignedMembers.filter(
        (member) => member.toString() !== e.target.value.toString()
      );
      setAssignedMembers(newMembers);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newIssue = {
      name: issue.name,
      description: issue.description,
      labels: issue.labels,
      projectId: issue.project._id,
      assignees: assignedMembers,
    };

    axios
      .put(`/api/issue/${issue._id}`, {
        issue: newIssue,
        username: props.user.username,
      })
      .then((response) => {
        if (response && response.data) {
          props.setMessages(response.data);
          props.history.goBack();
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          setErrors(error);
          props.history.goBack();
        }
      });
  };

  const renderProjectLabels = () => {
    const projectLabels = [];

    if (issue && issue.project && issue.project.labels) {
      issue.project.labels.map((label, index) => {
        projectLabels.push(
          <div
            className="standard-form__input-container__dropdown-item"
            key={index}
          >
            <label
              htmlFor={`check${index}`}
              className="standard-form__input-container__dropdown-item-label"
              style={{
                background: `${label.backgroundColor}`,
                color: `${label.fontColor}`,
              }}
            >
              {label.name}
            </label>
            <input
              type="checkbox"
              className="standard-form__input-container__dropdown-item-input"
              value={label._id}
              id={`check${index}`}
              checked={issue.labels.includes(label._id.toString())}
              onChange={(e) => {
                handleLabelChange(e);
              }}
            />
          </div>
        );
      });
    }

    return projectLabels;
  };

  if (Object.keys(issue).length > 0) {
    return (
      <div className="standard-form__wrapper">
        <div className="standard-form__header">
          <h2>Edit Issue</h2>
        </div>
        <div className="standard-form__body standard-form__body--no-padding">
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <div className="standard-form__split-double">
              <section>
                <div
                  className={`standard-form__input-container standard-form__input-container--fixed-h ${
                    showPreview && "hidden"
                  }`}
                >
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={issue.name}
                    onChange={(e) => {
                      var newIssue = { ...issue };
                      newIssue.name = e.target.value;
                      setIssue(newIssue);
                    }}
                    maxLength="60"
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="standard-form__input-container standard-form__input-container--fill">
                  <label htmlFor="description">Description</label>
                  <textarea
                    type="text"
                    className="standard-form__input-container-textarea standard-form__input-container-textarea--fill"
                    name="description"
                    autoComplete="off"
                    value={issue.description}
                    onChange={(e) => {
                      var newIssue = { ...issue };
                      newIssue.description = e.target.value;
                      setIssue(newIssue);
                    }}
                    required
                  />
                  <div
                    className={`standard-form__description-preview-btn ${
                      showPreview && "active"
                    }`}
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    <Tooltip
                      title="Markdown Preview"
                      position="bottom"
                      size="small"
                    >
                      <PreviewSVG />
                    </Tooltip>
                  </div>
                  <div
                    className={`standard-form__input-container__description-info`}
                  >
                    <Tooltip
                      title="You can use markdown in your description"
                      position="bottom"
                      size="small"
                    >
                      <InfoSVG />
                    </Tooltip>
                  </div>
                </div>
                <button className="standard-form__btn">Edit Issue</button>
              </section>
              <section>
                <div className="standard-form__split-double__section-content-wrapper">
                  <div
                    className={`standard-form__split-double__section-content ${
                      showPreview && "show-preview"
                    }`}
                  >
                    <div className="standard-form__preview-view">
                      <ReactMarkdown>{issue.description}</ReactMarkdown>
                    </div>
                  </div>
                  <div
                    className={`standard-form__split-double__section-content ${
                      showPreview && "hide-content"
                    }`}
                  >
                    <div className="standard-form__input-container standard-form__input-container--bottom-border standard-form__input-container--mb-sm">
                      <label
                        htmlFor=""
                        onClick={() => {
                          const dropdowns = document.querySelectorAll(
                            ".standard-form__input-container__dropdown"
                          );

                          if (dropdowns.length > 0) {
                            dropdowns.forEach((dropdown) => {
                              if (
                                dropdown.getAttribute("id") !==
                                  "labels-dropdown" &&
                                dropdown.classList.contains("open")
                              )
                                dropdown.classList.remove("open");
                            });
                          }

                          if (document.querySelector("#labels-dropdown"))
                            document
                              .querySelector("#labels-dropdown")
                              .classList.toggle("open");
                        }}
                      >
                        Labels <CaretDownNoFillSVG />
                      </label>
                      <div
                        className="standard-form__input-container__dropdown"
                        id="labels-dropdown"
                      >
                        {renderProjectLabels()}
                      </div>
                    </div>

                    {issue.project &&
                      issue.project["team"] &&
                      members.length > 0 && (
                        <div className="standard-form__input-container standard-form__input-container--bottom-border standard-form__input-container--mb-sm">
                          <label
                            htmlFor=""
                            onClick={() => {
                              const dropdowns = document.querySelectorAll(
                                ".standard-form__input-container__dropdown"
                              );

                              if (dropdowns.length > 0) {
                                dropdowns.forEach((dropdown) => {
                                  if (
                                    dropdown.getAttribute("id") !==
                                      "assign-members-dropdown" &&
                                    dropdown.classList.contains("open")
                                  )
                                    dropdown.classList.remove("open");
                                });
                              }

                              if (
                                document.querySelector(
                                  "#assign-members-dropdown"
                                )
                              )
                                document
                                  .querySelector("#assign-members-dropdown")
                                  .classList.toggle("open");
                            }}
                          >
                            Assign Members <CaretDownNoFillSVG />
                          </label>
                          <div
                            className="standard-form__input-container__dropdown"
                            id="assign-members-dropdown"
                          >
                            {members &&
                              members.map((member, index) => (
                                <div
                                  className="standard-form__input-container__dropdown-item"
                                  key={index}
                                >
                                  <label
                                    htmlFor={`check${member._id}`}
                                    className="standard-form__input-container__dropdown-item-label standard-form__input-container__dropdown-item-member-label"
                                  >
                                    {member.username}
                                  </label>
                                  <input
                                    type="checkbox"
                                    className="standard-form__input-container__dropdown-item-input"
                                    value={member._id}
                                    id={`check${member._id}`}
                                    checked={assignedMembers.includes(
                                      member._id.toString()
                                    )}
                                    onChange={(e) => {
                                      handleMemberChange(e);
                                    }}
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </section>
            </div>
          </form>
        </div>
      </div>
    );
  } else if (isLoading) return <Spinner />;
  else return null;
};

const mapStateToProps = (state) => ({
  user: state.user.user,
});

const mapDispatchToProps = {
  setErrors,
  setMessages,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditIssue);
