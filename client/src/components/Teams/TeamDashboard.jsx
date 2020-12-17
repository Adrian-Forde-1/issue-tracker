import React, { useEffect, useState, lazy, Suspense } from "react";

//Axios
import axios from "axios";

import { Route, Switch, Redirect } from "react-router-dom";

//Tippy
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";

//Redux
import { connect } from "react-redux";

//Actions
import { setErrors } from "../../redux/actions/userActions";

//React Router DOM
import { Link } from "react-router-dom";

//SVG
import PlusSVG from "../SVG/PlusSVG";
import PeopleWavingSVG from "../SVG/PeopleWavingSVG";

//Compoenents
import TeamPreview from "../Preview/TeamPreview";
import CreateTeam from "../Teams/CreateTeam";
import JoinTeam from "../Teams/JoinTeam";

import SideNav from "../Navigation/SideNav";
import DashboardNavbar from "../Navigation/DashboardNavbar";

import Issue from "../Issues/Issue";
import NewIssue from "../Issues/NewIssue";
import EditIssue from "../Issues/EditIssue";

import Labels from "../Labels/Labels";
import AddLabel from "../Labels/AddLabel";
import EditLabel from "../Labels/EditLabel";

import CreateTeamProject from "./CreateTeamProject";
import Project from "../Projects/Project";
import EditProject from "../Projects/EditProject";

const Team = lazy(() => {
  return import("./Team");
});

function TeamDashboard(props) {
  const categories = {
    Teams: "Teams",
    Chat: "Chat",
  };
  const [teams, setTeams] = useState([]);
  const [currentTeam, setCurrentTeam] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentCategory, setCurrentCategory] = useState(categories.Teams);

  useEffect(() => {
    getTeams();
  }, []);

  useEffect(() => {
    setTeams(props.teams);
  }, [props.teams]);

  let routes = (
    <Switch>
      <Route exact path="/team">
        <h1>Teams stuff</h1>
      </Route>
      <Route
        exact
        path="/team/create"
        render={(props) => {
          return (
            <CreateTeam
              {...props}
              setCurrentTeam={setCurrentTeam}
              getTeams={getTeams}
            />
          );
        }}
      />
      <Route
        exact
        path="/team/join"
        render={(props) => {
          return (
            <JoinTeam
              {...props}
              setCurrentTeam={setCurrentTeam}
              getTeams={getTeams}
            />
          );
        }}
      />
      <Route
        exact
        path="/team/:teamId"
        render={(props) => {
          return <Team {...props} setCurrentTeam={setCurrentTeam} />;
        }}
      />
      <Route
        exact
        path="/team/project/:projectId"
        render={(props) => {
          return <Project {...props} setCurrentTeam={setCurrentTeam} />;
        }}
      />
      <Route
        exact
        path="/team/project/:projectId/edit"
        render={(props) => {
          return <EditProject {...props} setCurrentTeam={setCurrentTeam} />;
        }}
      />

      <Route
        path="/team/project/:projectId/new/label"
        render={(props) => {
          return <AddLabel {...props} setCurrentTeam={setCurrentTeam} />;
        }}
      />
      <Route
        path="/team/project/:projectId/labels"
        render={(props) => {
          return <Labels {...props} setCurrentTeam={setCurrentTeam} />;
        }}
      />
      <Route
        path="/team/project/:projectId/issue/:issueId/edit"
        render={(props) => {
          return <EditIssue {...props} setCurrentTeam={setCurrentTeam} />;
        }}
      />
      <Route
        path="/team/project/:projectId/label/:labelId/edit"
        render={(props) => {
          return <EditLabel {...props} setCurrentTeam={setCurrentTeam} />;
        }}
      />
      <Route
        path="/team/project/:projectId/new/issue"
        render={(props) => {
          return <NewIssue {...props} setCurrentTeam={setCurrentTeam} />;
        }}
      />
      <Route
        exact
        path="/team/:teamId/project/create"
        render={(props) => {
          return (
            <CreateTeamProject {...props} setCurrentTeam={setCurrentTeam} />
          );
        }}
      />
      <Route
        exact
        path="/team/project/:projectId/issue/:issueId"
        render={(props) => {
          return <Issue {...props} setCurrentTeam={setCurrentTeam} />;
        }}
      />
      <Redirect to="/team" />
    </Switch>
  );

  const getTeams = () => {
    axios
      .get("/api/teams", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((response) => {
        if (response && response.data) {
          console.log(response.data);
          setTeams(response.data);
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          props.setErrors(error);
        }
      });
  };

  const renderTeams = () => {
    var renderedTeams = [];
    if (teams && teams.length > 0) {
      if (search === "") {
        teams.map((team) => {
          renderedTeams.push(
            <TeamPreview
              team={team}
              key={team._id}
              currentTeam={currentTeam.toString() === team._id.toString()}
              getTeams={getTeams}
            />
          );
        });
      } else {
        teams.map((team) => {
          if (team.name.toLowerCase().indexOf(search.toLowerCase()) > -1) {
            renderedTeams.push(
              <TeamPreview
                team={team}
                key={team._id}
                currentTeam={currentTeam.toString() === team._id.toString()}
                getTeams={getTeams}
              />
            );
          }
        });
      }
    }

    return renderedTeams;
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
            <div className="dashboard__main-content-sidebar__category-selector-container">
              <div
                className={`${
                  currentCategory === categories.Teams && "selected"
                }`}
                onClick={() => setCurrentCategory(categories.Teams)}
              >
                <span>Team</span>
              </div>
              <div
                className={`${
                  currentCategory === categories.Chat && "selected"
                }`}
                onClick={() => setCurrentCategory(categories.Chat)}
              >
                <span>Chat</span>
              </div>
            </div>
            {currentCategory === categories.Teams && (
              <div className="dashboard__quick-links-container">
                <Link to={`/team/create`}>
                  <Tooltip title="Create Team" position="bottom" size="small">
                    <PlusSVG />
                  </Tooltip>
                </Link>
                <Link to={`/team/join`}>
                  <Tooltip title="Join Team" position="bottom" size="small">
                    <PeopleWavingSVG />
                  </Tooltip>
                </Link>
              </div>
            )}
            <div className="dashboard__main-content-sidebar__team-list">
              {renderTeams()}
            </div>
          </div>
          <div
            className={`dashboard__main-content-body ${
              sidebarOpen && "shrink"
            }`}
          >
            <Suspense fallback="Loading">{routes}</Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  setErrors,
};

export default connect(null, mapDispatchToProps)(TeamDashboard);
