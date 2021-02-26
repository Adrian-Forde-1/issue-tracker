import React, { useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";

//Tippy
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";

//Axios
import axios from "axios";

//React Router DOM
import { Link } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//Actions
import { setErrors, setMessages } from "../../redux/actions/userActions";

//SVG
import ArchiveSVG from "../SVG/ArchiveSVG";
import UnarchiveSVG from "../SVG/UnarchiveSVG";
import TrashSVG from "../SVG/TrashSVG";
import EditSVG from "../SVG/EditSVG";
import CaretDownNoFillSVG from "../SVG/CaretDownNoFillSVG";

//Components
import SearchBar from "../SearchBar";
import IssuePreview from "../Preview/IssuePreview";
import Modal from "../Modal/Modal";
import Spinner from "../Misc/Spinner/Spinner";

const Project = (props) => {
  const filterTypes = {
    All: "All",
    "New Issue": "New Issue",
    "Work In Progress": "Work In Progress",
    Completed: "Completed",
  };
  const modalTypes = {
    "Delete Modal": "Delete Modal",
  };

  const [project, setProject] = useState({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [projectId, setProjectId] = useState(props.match.params.projectId);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (props.match.params.projectId)
      setProjectId(props.match.params.projectId);
  }, [props.match.params]);

  useEffect(() => {
    getProjectData();
  }, [projectId]);

  const handleSearchChange = (e) => {
    sessionStorage.setItem("project-search", e.target.value);
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (sessionStorage.getItem("project-search") !== null) {
      setSearch(sessionStorage.getItem("project-search"));
    }

    if (sessionStorage.getItem("project-filter") !== null) {
      setFilter(sessionStorage.getItem("project-filter"));
    }
  }, []);

  const getProjectData = () => {
    setProject({});
    setIsLoading(true);
    axios
      .get(`/api/project/${projectId}`)
      .then((response) => {
        if (response && response.data) {
          if (
            (response.data.team !== null &&
              props.location.pathname.toString().indexOf("team") === -1) ||
            (response.data.team === null &&
              props.location.pathname.toString().indexOf("team") > -1)
          ) {
            props.history.goBack();
          } else {
            setProject(response.data);
          }

          if (props.location.pathname.toString().indexOf("team") > -1) {
            props.setCurrentTeam(response.data.team);
          } else {
            props.setCurrentProject(response.data._id);
          }
        } else {
          props.setErrors(["Something went wrong"]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (err && err.response && err.response.data) {
          props.setErrors(err);
        }
        if (
          err &&
          err.response &&
          err.response.status &&
          err.response.status === 404
        ) {
          props.history.replace("/project/404");
        } else {
          props.history.push(
            props.location.pathname.toString().indexOf("team") > -1
              ? `/team/${props.match.params.teamId}`
              : "/project"
          );
        }
        setIsLoading(false);
      });
  };

  const archiveProject = () => {
    axios
      .put(`/api/project/${project._id}/archive/add`, null)
      .then(() => {
        axios
          .get(`/api/project/${projectId}`)
          .then((response) => {
            setProject(response.data);
          })
          .catch((error) => {
            props.setErrors(error);
            props.history.push("/project");
          });
      })
      .catch((error) => {
        props.setErrors(error);
        props.history.push("/project");
      });
  };

  const unarchiveProject = () => {
    axios
      .put(`/api/project/${project._id}/archive/remove`, null)
      .then(() => {
        axios
          .get(`/api/project/${projectId}`)
          .then((response) => {
            setProject(response.data);
          })
          .catch((error) => {
            props.setErrors(error);
            props.history.push("/project");
          });
      })
      .catch((error) => {
        props.setErrors(error);
        props.history.push("/project");
      });
  };

  const deleteProject = () => {
    axios
      .delete(`/api/project/${project._id}`)
      .then((res) => {
        if (res && res.data) {
          setMessages(res.data);
          if (props.getProjects) props.getProjects();
          props.history.goBack();
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

  const renderIssues = () => {
    var projectIssues = [];

    if (project.issues && project.issues.length > 0) {
      project.issues.map((issue, index) => {
        if (filter === filterTypes.All) {
          if (search === "") {
            projectIssues.push(
              <IssuePreview
                issue={issue}
                labels={project.labels}
                index={index}
                pathname={props.location.pathname}
                team={project.team}
                key={index}
                getProjectData={getProjectData}
              />
            );
          } else if (
            issue.name.toLowerCase().indexOf(search.toLowerCase()) > -1
          ) {
            projectIssues.push(
              <IssuePreview
                issue={issue}
                labels={project.labels}
                index={index}
                pathname={props.location.pathname}
                team={project.team}
                key={index}
                getProjectData={getProjectData}
              />
            );
          }
        } else {
          if (issue.status.name === filter) {
            if (search === "") {
              projectIssues.push(
                <IssuePreview
                  issue={issue}
                  index={index}
                  labels={project.labels}
                  pathname={props.location.pathname}
                  team={project.team}
                  key={index}
                  getProjectData={getProjectData}
                />
              );
            } else if (
              issue.name.toLowerCase().indexOf(search.toLowerCase()) > -1
            ) {
              projectIssues.push(
                <IssuePreview
                  issue={issue}
                  index={index}
                  labels={project.labels}
                  pathname={props.location.pathname}
                  team={project.team}
                  key={index}
                  getProjectData={getProjectData}
                />
              );
            }
          }
        }
      });
    } else
      return (
        <div className="project__no-issues">
          <p>No Issues found</p>
        </div>
      );
    return projectIssues;
  };

  if (
    props &&
    props.user &&
    project.createdBy &&
    Object.keys(project).length > 0
  ) {
    return (
      <div className="project__wrapper">
        {renderModal()}
        <React.Fragment>
          <div className="project__header">
            <div className="project__name">{project.name && project.name}</div>
            {props.user &&
              props.user._id &&
              project.createdBy._id.toString() ===
                props.user._id.toString() && (
                <div className="project__action-buttons-container">
                  {/* `<div
                  onClick={() => {
                    if (project.archived === false) {
                      archiveProject();
                    } else {
                      unarchiveProject();
                    }
                  }}
                >
                  {project.archived ? (
                    <Tooltip
                      title="Unarchive Project"
                      position="bottom"
                      size="small"
                    >
                      <UnarchiveSVG />
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title="Archive Project"
                      position="bottom"
                      size="small"
                    >
                      <ArchiveSVG />
                    </Tooltip>
                  )}
                </div>` */}
                  <div>
                    <Link
                      to={`${
                        project.team !== null ? "/team/project/" : "/project/"
                      }${project._id}/edit`}
                    >
                      <Tooltip
                        title="Edit Project"
                        position="bottom"
                        size="small"
                      >
                        <EditSVG />
                      </Tooltip>
                    </Link>
                  </div>

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalType(modalTypes["Delete Modal"]);
                      setShowModal(true);
                    }}
                  >
                    {" "}
                    <Tooltip
                      title="Delete Project"
                      position="bottom"
                      size="small"
                    >
                      <TrashSVG />
                    </Tooltip>
                  </div>
                </div>
              )}
          </div>
          <div className="project__creation-date">
            Created By
            <span> {project.createdBy.username} </span>
            <span> &middot; </span>
            {new Date(project.createdAt).toDateString()}
          </div>
          <div className="project__description">
            <div
              className="project__description-name"
              onClick={() => setShowDescription(!showDescription)}
            >
              <span>Description</span> <CaretDownNoFillSVG />
            </div>
            <div
              className={`project__description-dropdown ${
                showDescription && "visible"
              }`}
            >
              <ReactMarkdown>{project.description}</ReactMarkdown>
            </div>
          </div>

          <div className="project__action-bar">
            <Link
              to={`${project.team !== null ? "/team/project/" : "/project/"}${
                project._id
              }/labels`}
            >
              Labels <i className="fas fa-tags"></i>
            </Link>
            <Link
              to={`${project.team !== null ? "/team/project/" : "/project/"}${
                project._id
              }/new/issue`}
            >
              New Issue
            </Link>
          </div>
          <div className="project__search-bar-container">
            <SearchBar
              onChange={handleSearchChange}
              search={search}
              placeholder="Search by Issue name"
              extraClass="search-extra-info"
            />
            <div className="project__filter-selector">
              <select
                name="filter-selector"
                id="filter-selector"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {Object.keys(filterTypes).map((filterType, index) => (
                  <option value={filterType} key={index}>
                    {filterType}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="project__issues-container">{renderIssues()}</div>
        </React.Fragment>
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
  projectUpdated: state.projects.projectUpdated,
  errors: state.user.errors,
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
