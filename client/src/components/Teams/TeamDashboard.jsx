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

import CreateTeam from "./CreateTeam";
import JoinTeam from "./JoinTeam";
import CreateTeamProject from "./CreateTeamProject";
import TeamDashboardLandingPage from "./TeamDashboardLandingPage";
import TeamManagement from "./TeamManagement/TeamManagement";

import TeamChat from "../Chat/TeamChat";
import TeamChatLandingPage from "../Chat/TeamChatLandingPage";

import SideNav from "../Navigation/SideNav";
import DashboardNavbar from "../Navigation/DashboardNavbar";

import Issue from "../Issues/Issue";
import NewIssue from "../Issues/NewIssue";
import EditIssue from "../Issues/EditIssue";
import IssueHistory from "../Issues/IssueHistory";

import Labels from "../Labels/Labels";
import AddLabel from "../Labels/AddLabel";
import EditLabel from "../Labels/EditLabel";

import Project from "../Projects/Project";
import EditProject from "../Projects/EditProject";

import NotFound from "../Misc/NotFound";
import Spinner from "../Misc/Spinner/Spinner";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTeams();
  }, []);

  useEffect(() => {
    if (
      props.location.pathname.indexOf("chat") === -1 &&
      currentCategory === categories.Chat
    )
      setCurrentCategory(categories.Teams);
    else if (
      props.location.pathname.indexOf("chat") > -1 &&
      currentCategory === categories.Teams
    )
      setCurrentCategory(categories.Chat);
  }, [props.location.pathname]);

  useEffect(() => {
    setTeams(props.teams);
  }, [props.teams]);

  let routes = (
    <Switch>
      <Route
        exact
        path="/team"
        render={(props) => {
          return (
            <TeamDashboardLandingPage
              {...props}
              setCurrentTeam={setCurrentTeam}
            />
          );
        }}
      />
      <Route
        exact
        path="/team/404"
        render={(props) => {
          return <NotFound {...props} setCurrentTeam={setCurrentTeam} />;
        }}
      />
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
        path="/team/chat"
        render={(props) => {
          return (
            <Route
              exact
              path="/team/chat"
              render={(props) => {
                return (
                  <TeamChatLandingPage
                    {...props}
                    setCurrentTeam={setCurrentTeam}
                  />
                );
              }}
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
        path="/team/chat/:teamId"
        render={(props) => {
          return <TeamChat {...props} setCurrentTeam={setCurrentTeam} />;
        }}
      />
      <Route
        exact
        path="/team/management/:teamId"
        render={(props) => {
          return <TeamManagement {...props} setCurrentTeam={setCurrentTeam} />;
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
        path="/team/project/issue/:issueId/history"
        render={(props) => {
          return <IssueHistory {...props} setCurrentTeam={setCurrentTeam} />;
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
    setIsLoading(true);
    axios
      .get("/api/teams")
      .then((response) => {
        if (response && response.data) {
          setTeams(response.data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          props.setErrors(error);
        }
        setIsLoading(false);
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
              currentCategory={currentCategory}
              categories={categories}
              setCurrentTeam={setCurrentTeam}
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
                onClick={() => {
                  setCurrentCategory(categories.Teams);
                  props.history.push("/team");
                }}
              >
                <span>Team</span>
              </div>
              <div
                className={`${
                  currentCategory === categories.Chat && "selected"
                }`}
                onClick={() => {
                  setCurrentCategory(categories.Chat);
                  props.history.push("/team/chat");
                }}
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
              {teams && teams.length > 0 ? (
                <>{renderTeams()}</>
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
  );
}

const mapDispatchToProps = {
  setErrors,
};

export default connect(null, mapDispatchToProps)(TeamDashboard);
