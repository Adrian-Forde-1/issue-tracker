import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

//Axios
import axios from "axios";

//Tippy
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";

//Redux
import { connect } from "react-redux";

//React Router DOM
import { withRouter } from "react-router-dom";

//Actions
import { getUserProjects } from "../../redux/actions/projectActions";
import { setErrors, setMessages } from "../../redux/actions/userActions";

//SVG
import CaretDownNoFillSVG from "../SVG/CaretDownNoFillSVG";
import PreviewSVG from "../SVG/PreviewSVG";
import InfoSVG from "../SVG/InfoSVG";

const NewIssue = (props) => {
  const [project, setProject] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [labels, setLabels] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const projectId = props.match.params.projectId;

    axios
      .get(`/api/project/${projectId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((response) => {
        if (response && response.data) {
          setProject(response.data);

          //If project is in a team, get all the members from that team
          if (response.data.team !== null) {
            axios
              .get(`/api/team/${response.data.team}`, {
                headers: { Authorization: localStorage.getItem("token") },
              })
              .then((response) => {
                if (response && response.data) {
                  setMembers(response.data.users);
                }
              })
              .catch((error) => {
                if (error && error.response) {
                  props.setErrors(error);
                  props.history.goBack();
                }
              });
          }

          if (
            props.match.params &&
            props.match.params.toString().indexOf("team" > -1)
          ) {
            props.setCurrentTeam(response.data.team);
          }
        }
      })
      .catch((error) => {
        if (error && error.response) {
          props.setErrors(error);
          props.history.goBack();
        }
      });
  }, []);

  const handleMemberChange = (e) => {
    if (e.target.checked) {
      const newMembers = [...assignedMembers, e.target.value];
      setAssignedMembers(newMembers);
    } else {
      const newMembers = assignedMembers.filter(
        (member) => member.toString() !== e.target.value.toString()
      );
      setAssignedMembers(newMembers);
    }
  };

  const handleLabelChange = (e) => {
    if (e.target.checked) {
      const label = project.labels.find(
        (label) => label._id.toString() === e.target.value.toString()
      );
      const newLabels = [...labels, label._id];
      setLabels(newLabels);
    } else {
      const newLabels = labels.filter(
        (label) => label.toString() !== e.target.value.toString()
      );
      setLabels(newLabels);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const issue = {
      name: name,
      description: description,
      labels: labels,
      projectId: project._id,
      assignees: assignedMembers,
    };

    axios
      .post(
        "/api/issue",
        { issue: issue },
        { headers: { Authorization: localStorage.getItem("token") } }
      )
      .then((res) => {
        props.getUserProjects(localStorage.getItem("token"));
        props.setMessages(res.data);
        props.history.goBack();
      })
      .catch((error) => {
        if (error && error.response) {
          props.setErrors(error);
          props.history.goBack();
        }
      });
  };
  return (
    <div className="standard-form__wrapper">
      <div className="standard-form__header">
        <h2>New Issue</h2>
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
              <button className="standard-form__btn">Add Issue</button>
            </section>
            <section>
              <div className="standard-form__split-double__section-content-wrapper">
                <div
                  className={`standard-form__split-double__section-content ${
                    showPreview && "show-preview"
                  }`}
                >
                  <div className="standard-form__preview-view">
                    <ReactMarkdown>{description}</ReactMarkdown>
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
                      {project.labels &&
                        project.labels.map((label, index) => (
                          <div className="standard-form__input-container__dropdown-item">
                            <label
                              key={index}
                              htmlFor={`check${index}`}
                              className="standard-form__input-container__dropdown-item-label"
                              style={{
                                background: `${label.color}`,
                                color: "white",
                              }}
                            >
                              {label.name}
                            </label>
                            <input
                              type="checkbox"
                              className="standard-form__input-container__dropdown-item-input"
                              value={label._id}
                              id={`check${index}`}
                              onChange={(e) => {
                                handleLabelChange(e);
                              }}
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  {project["team"] && members.length > 0 && (
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
                            document.querySelector("#assign-members-dropdown")
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
                            <div className="standard-form__input-container__dropdown-item">
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
};

const mapDispatchToProps = {
  setErrors,
  setMessages,
  getUserProjects,
};

export default connect(null, mapDispatchToProps)(withRouter(NewIssue));
