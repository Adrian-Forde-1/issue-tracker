import React, { useEffect, useState, Suspense, lazy } from "react";

//Axios
import axios from "axios";

//Tippy
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";

//Redux
import { connect } from "react-redux";

//React Router DOM
import { Link, Route, Switch, Redirect } from "react-router-dom";

//SVG
import ArchiveSVG from "../SVG/ArchiveSVG";
import PlusSVG from "../SVG/PlusSVG";
import PeopleWavingSVG from "../SVG/PeopleWavingSVG";

//Actions
import { setErrors, logoutUser } from "../../redux/actions/userActions";

//Components
import ProjectPreview from "../Preview/ProjectPreview";
import SearchBar from "../SearchBar";

import SideNav from "../Navigation/SideNav";
import DashboardNavbar from "../Navigation/DashboardNavbar";

import Issue from "../Issues/Issue";
import NewIssue from "../Issues/NewIssue";
import EditIssue from "../Issues/EditIssue";
import IssueHistory from "../Issues/IssueHistory";

import Labels from "../Labels/Labels";
import AddLabel from "../Labels/AddLabel";
import EditLabel from "../Labels/EditLabel";

import Project from "./Project";
import ProjectDashboardLandingPage from "./ProjectDashboardLandingPage";
import CreateProject from "./CreateProject";
import EditProject from "./EditProject";

import NotFound from "../Misc/NotFound";
import Spinner from "../Misc/Spinner/Spinner";

function ProjectDashboard(props) {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProjects();
  }, []);

  const onChange = (e) => {
    setSearch(e.target.value);
  };

  const getProjects = () => {
    setIsLoading(true);
    axios
      .get("/api/projects")
      .then((res) => {
        if (res && res.data) {
          setProjects(res.data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.response);
        if (err && err.response && err.response.data) {
          if (err.response.status === 401) props.logoutUser(props.history);
          else props.setErrors(err);
        }
        setIsLoading(false);
      });
  };

  let routes = (
    <Switch>
      <Route
        exact
        path="/project"
        render={(props) => {
          return (
            <ProjectDashboardLandingPage
              {...props}
              setCurrentProject={setCurrentProject}
            />
          );
        }}
      />
      <Route
        exact
        path="/project/404"
        render={(props) => {
          return <NotFound {...props} setCurrentProject={setCurrentProject} />;
        }}
      />
      <Route
        exact
        path="/project/create"
        render={(props) => {
          return (
            <CreateProject
              {...props}
              setCurrentProject={setCurrentProject}
              getProjects={getProjects}
            />
          );
        }}
      />
      <Route
        exact
        path="/project/:projectId"
        render={(props) => {
          return (
            <Project
              {...props}
              setCurrentProject={setCurrentProject}
              getProjects={getProjects}
            />
          );
        }}
      />
      <Route
        path="/project/:projectId/edit"
        render={(props) => {
          return (
            <EditProject {...props} setCurrentProject={setCurrentProject} />
          );
        }}
      />
      <Route
        path="/project/:projectId/labels"
        render={(props) => {
          return <Labels {...props} setCurrentProject={setCurrentProject} />;
        }}
      />
      <Route
        path="/project/:projectId/new/label"
        render={(props) => {
          return <AddLabel {...props} setCurrentProject={setCurrentProject} />;
        }}
      />
      <Route
        path="/project/issue/:issueId/history"
        render={(props) => {
          return (
            <IssueHistory {...props} setCurrentProject={setCurrentProject} />
          );
        }}
      />
      <Route
        path="/project/:projectId/issue/:issueId/edit"
        render={(props) => {
          return <EditIssue {...props} setCurrentProject={setCurrentProject} />;
        }}
      />
      <Route
        path="/project/:projectId/label/:labelId/edit"
        render={(props) => {
          return <EditLabel {...props} setCurrentProject={setCurrentProject} />;
        }}
      />
      <Route
        path="/project/:projectId/new/issue"
        render={(props) => {
          return <NewIssue {...props} setCurrentProject={setCurrentProject} />;
        }}
      />
      <Route
        exact
        path="/project/:projectId/issue/:issueId"
        render={(props) => {
          return <Issue {...props} setCurrentProject={setCurrentProject} />;
        }}
      />
    </Switch>
  );

  const renderProjects = () => {
    var renderedProjects = [];
    if (projects && projects.length > 0) {
      if (search === "") {
        projects.map((project) => {
          renderedProjects.push(
            <ProjectPreview
              project={project}
              key={project._id}
              small={true}
              selected={project._id.toString() === currentProject.toString()}
              getProjects={getProjects}
            />
          );
        });
      } else {
        projects.map((project) => {
          if (
            project.name.toLowerCase().indexOf(search.toLowerCase()) > -1 &&
            project.archived === false
          ) {
            renderedProjects.push(
              <ProjectPreview
                project={project}
                key={project._id}
                small={true}
                selected={project._id.toString() === currentProject.toString()}
                getProjects={getProjects}
              />
            );
          }
        });
      }
    }
    return renderedProjects;
  };

  return (
    <div className="dashboard__wrapper" style={{ position: "relative" }}>
      <div className="dashboard__side-nav">
        <SideNav />
      </div>
      <div className="dashboard__main-content">
        <DashboardNavbar
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
        />
        <div className="dashboard__main-content-container">
          <div
            className={`dashboard__main-content-sidebar ${
              sidebarOpen && "open"
            }`}
          >
            <div
              className="dashboard__quick-links-container"
              style={{ marginBottom: "10px" }}
            >
              <Link to={`/project/create`}>
                <Tooltip title="Create Project" position="bottom" size="small">
                  <PlusSVG />
                </Tooltip>
              </Link>
            </div>
            <div className="dashboard__main-content-sidebar__team-list">
              {projects && projects.length > 0 ? (
                <>{renderProjects()}</>
              ) : isLoading ? (
                <Spinner />
              ) : null}
            </div>
          </div>
          <div
            className={`dashboard__main-content-body ${
              sidebarOpen && "shrink"
            }`}
          >
            <Suspense fallback={<Spinner />}>{routes}</Suspense>
          </div>
        </div>
      </div>
    </div>

    // <div
    //   className="d-flex flex-column p-l-175"
    //   style={{ position: "relative" }}
    // >
    //   <div className="under-nav-section">
    //     <SearchBar search={search} onChange={onChange} />
    //     <div className="under-nav-section-links">
    //       <Link to="/create/project" className="action-btn">
    //         <i className="fas fa-plus-square "></i>
    //       </Link>
    //       <Link to={`/projects/archived`} className="action-btn extra-right">
    //         <i className="fas fa-archive "></i>
    //       </Link>
    //     </div>
    //   </div>
    //   <h3 className="section-title">Projects</h3>
    //   {projects && projects.length > 0 && search === ""
    //     ? projects.map((project) => {
    //         if (project.archived === false)
    //           return <ProjectPreview project={project} key={project._id} />;
    //       })
    //     : projects.map((project) => {
    //         if (
    //           project.name.toLowerCase().indexOf(search.toLowerCase()) > -1 &&
    //           project.archived === false
    //         )
    //           return <ProjectPreview project={project} key={project._id} />;
    //       })}
    // </div>
  );
}

const mapDispatchToProps = {
  setErrors,
  logoutUser,
};

export default connect(null, mapDispatchToProps)(ProjectDashboard);
