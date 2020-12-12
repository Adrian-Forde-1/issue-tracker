import React, { useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";

//Axios
import axios from "axios";

//Tostify
import { toast } from "react-toastify";

//React Router DOM
import { Link } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//Actions
import {
  getUserProjects,
  setProjectUpdated,
} from "../../redux/actions/projectActions";
import { setErrors, clearErrors } from "../../redux/actions/userActions";

import {
  showModal,
  setDeleteItem,
  setItemType,
  setCurrentLocation,
} from "../../redux/actions/modalActions";

//SVG
import ArchiveSVG from "../SVG/ArchiveSVG";
import UnarchiveSVG from "../SVG/UnarchiveSVG";
import TrashSVG from "../SVG/TrashSVG";
import EditSVG from "../SVG/EditSVG";
import CaretDownNoFillSVG from "../SVG/CaretDownNoFillSVG";

//Components
import SearchBar from "../SearchBar";
import IssuePreview from "../Preview/IssuePreview";
import SideNav from "../Navigation/SideNav";
import ProjectsTeamsHamburger from "../Navigation/ProjectsTeamsHamburger";

const Project = (props) => {
  const [project, changeProject] = useState({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showDescription, setShowDescription] = useState(false);
  const projectId = props.match.params.projectId;

  const handleSearchChange = (e) => {
    sessionStorage.setItem("project-search", e.target.value);
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    sessionStorage.setItem("project-filter", e.target.value);
    setFilter(e.target.value);
  };

  useEffect(() => {
    props.getUserProjects(localStorage.getItem("token"));

    if (sessionStorage.getItem("project-search") !== null) {
      setSearch(sessionStorage.getItem("project-search"));
    }

    if (sessionStorage.getItem("project-filter") !== null) {
      setFilter(sessionStorage.getItem("project-filter"));
    }

    getProjectData();
  }, []);

  useEffect(() => {
    if (props.projectUpdated === true) {
      axios
        .get(`/api/project/${projectId}`, {
          headers: { Authorization: localStorage.getItem("token") },
        })
        .then((response) => {
          changeProject(response.data);
        })
        .catch((error) => {
          props.setErrors(error);
          props.history.push("/projects");
        });

      props.setProjectUpdated(false);
    }
  }, [props.projectUpdated]);

  const getProjectData = () => {
    console.log("Get Project data called");
    axios
      .get(`/api/project/${projectId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((response) => {
        if (response && response.data) {
          changeProject(response.data);
          if (
            props.match.params &&
            props.match.params.toString().indexOf("team" > -1)
          ) {
            props.setCurrentTeam(response.data.team);
          }
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          props.setErrors(error);
          props.history.push(
            props.location.pathname.toString().indexOf("team") > -1
              ? `/team/${props.match.params.teamId}`
              : "/projects"
          );
        }
      });
  };

  const deleteModal = () => {
    props.setDeleteItem(project);
    props.setItemType("project");
    props.setCurrentLocation(props.history.location.pathname.split("/"));
    props.showModal();
  };

  const archiveProject = () => {
    axios
      .put(`/api/project/${project._id}/archive/add`, null, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then(() => {
        axios
          .get(`/api/project/${projectId}`, {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          })
          .then((response) => {
            changeProject(response.data);
          })
          .catch((error) => {
            props.setErrors(error);
            props.history.push("/projects");
          });
      })
      .catch((error) => {
        props.setErrors(error);
        props.history.push("/projects");
      });
  };

  const unarchiveProject = () => {
    axios
      .put(`/api/project/${project._id}/archive/remove`, null, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then(() => {
        axios
          .get(`/api/project/${projectId}`, {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          })
          .then((response) => {
            changeProject(response.data);
          })
          .catch((error) => {
            props.setErrors(error);
            props.history.push("/projects");
          });
      })
      .catch((error) => {
        props.setErrors(error);
        props.history.push("/projects");
      });
  };

  return (
    <div className="project__wrapper">
      {/* <ProjectsTeamsHamburger /> */}
      {/* <div className="under-nav-section">
        <SearchBar
          onChange={handleSearchChange}
          search={search}
          extraClass="search-extra-info"
        />
        <div className="select-container">
            <select name="" id="" value={filter} onChange={handleFilterChange}>
              <option value="All">All</option>
              <option value="New Issue">New Issue</option>
              <option value="Work In Progress">Work In Progress</option>
              <option value="Fixed">Fixed</option>
            </select>
          </div>
      </div> */}
      {Object.keys(project).length > 0 && (
        <React.Fragment>
          <div className="project__header">
            <div className="project__name">{project.name}</div>
            {project.createdBy.toString() === props.user._id.toString() && (
              <div className="project__action-buttons-container">
                <div
                  onClick={() => {
                    if (project.archived === false) {
                      archiveProject();
                    } else {
                      unarchiveProject();
                    }
                  }}
                >
                  {project.archived ? <UnarchiveSVG /> : <ArchiveSVG />}
                </div>
                <div>
                  <Link to={`/project/${project._id}/edit`}>
                    <EditSVG />
                  </Link>
                </div>

                <div onClick={deleteModal}>
                  {" "}
                  <TrashSVG />
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

          <div className="action-bar">
            <Link
              to={`${project.team !== null ? "/team/project/" : "/project/"}${
                project._id
              }/project/labels`}
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
          <div className="project__issues-container">
            {project.issues &&
              project.issues.length > 0 &&
              project.issues.map((issue, index) =>
                filter === "All" ? (
                  search === "" ? (
                    <IssuePreview
                      issue={issue}
                      labels={project.labels}
                      index={index}
                      pathname={props.location.pathname}
                      key={index}
                      getProjectData={getProjectData}
                    />
                  ) : (
                    issue.name.toLowerCase().indexOf(search.toLowerCase()) >
                      -1 && (
                      <IssuePreview
                        issue={issue}
                        labels={project.labels}
                        index={index}
                        pathname={props.location.pathname}
                        key={index}
                        getProjectData={getProjectData}
                      />
                    )
                  )
                ) : (
                  issue.status.name === filter &&
                  (search === "" ? (
                    <IssuePreview
                      issue={issue}
                      index={index}
                      pathname={props.location.pathname}
                      key={index}
                      getProjectData={getProjectData}
                    />
                  ) : (
                    issue.name.toLowerCase().indexOf(search.toLowerCase()) >
                      -1 && (
                      <IssuePreview
                        issue={issue}
                        index={index}
                        pathname={props.location.pathname}
                        key={index}
                        getProjectData={getProjectData}
                      />
                    )
                  ))
                )
              )}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

const mapDispatchToProps = {
  getUserProjects,
  setErrors,
  clearErrors,
  setProjectUpdated,
  showModal,
  setDeleteItem,
  setItemType,
  setCurrentLocation,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  projects: state.projects.projects,
  projectUpdated: state.projects.projectUpdated,
  errors: state.user.errors,
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
