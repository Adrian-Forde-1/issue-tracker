import React, { useEffect, useState, lazy, Suspense, Children } from "react";

import { Route, Switch, Redirect } from "react-router-dom";

//Tippy
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";

//Tostify
import { toast } from "react-toastify";

//Redux
import { connect } from "react-redux";

//Actions
import { getUserTeams } from "../../redux/actions/teamActions";

//React Router DOM
import { Link } from "react-router-dom";

//SVG
import ArchiveSVG from "../SVG/ArchiveSVG";
import PlusSVG from "../SVG/PlusSVG";
import PeopleWavingSVG from "../SVG/PeopleWavingSVG";

//Compoenents
import TeamPreview from "../Preview/TeamPreview";

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
  const [search, setSearch] = useState("");
  const [currentCategory, setCurrentCategory] = useState(categories.Teams);

  useEffect(() => {
    props.getUserTeams(localStorage.getItem("token"));
    if (props.teams && props.teams.length > 0) {
      setTeams(props.teams);
    }
  }, []);

  // useEffect(() => {
  //   if (props.match.params.teamId) setCurrentTeam(props.match.params.teamId);
  // }, [props.match.params]);

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
        path="/team/project/:projectId/new/issue"
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
        path="/team/project/:projectId/project/labels"
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

  return (
    <div className="teams__dashboard-wrapper" style={{ position: "relative" }}>
      <div className="teams__dashboard-side-nav">
        <SideNav />
      </div>
      <div className="teams__dashboard-main-content">
        <DashboardNavbar />
        <div className="teams__dashboard-main-content-container">
          <div className="teams__dashboard-main-content-sidebar">
            <div className="teams__dashboard-main-content-sidebar__category-selector-container">
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
              <div className="teams__dashboard__quick-links-container">
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
            <div className="teams__dashboard-main-content-sidebar__team-list">
              {teams && teams.length > 0 && search === ""
                ? teams.map((team) => (
                    <TeamPreview
                      team={team}
                      key={team._id}
                      currentTeam={
                        currentTeam.toString() === team._id.toString()
                      }
                    />
                  ))
                : teams.map((team) => {
                    if (
                      team.name.toLowerCase().indexOf(search.toLowerCase()) > -1
                    )
                      return (
                        <TeamPreview
                          team={team}
                          key={team._id}
                          currentTeam={
                            currentTeam.toString() === team._id.toString()
                          }
                        />
                      );
                  })}
            </div>
          </div>
          <div className="teams__dashboard-main-content-body">
            <Suspense fallback="Loading">{routes}</Suspense>
          </div>
        </div>
      </div>

      {/* <h3 className="section-title">Teams</h3>
      <div className="action-bar m-l-16">
        <Link to="/join/team">Join Team</Link>
      </div> */}
    </div>
  );
}

const mapDispatchToProps = {
  getUserTeams,
};

const mapStateToProps = (state) => ({
  teams: state.teams.teams,
  errors: state.user.errors,
});

export default connect(mapStateToProps, mapDispatchToProps)(TeamDashboard);

{
  /* <ProjectsTeamsHamburger />
          <div className="under-nav-section">
            <SearchBar search={search} onChange={onChange} />
            <Link to="/create/team" className="action-btn">
              <i className="fas fa-plus-square "></i>
            </Link>
          </div> */
}
