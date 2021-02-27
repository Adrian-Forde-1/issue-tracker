import React, { useEffect, useState } from "react";
import axios from "axios";

//Redux
import { connect } from "react-redux";

//React Router DOM
import { withRouter } from "react-router-dom";

//Actions
import { getUserTeams, setTeamUpdated } from "../../redux/actions/teamActions";
import {
  clearCurrentSectionAndId,
  setErrors,
} from "../../redux/actions/userActions";

//Components
import ProjectPreview from "../Preview/ProjectPreview";
import SideNav from "../Navigation/SideNav";
import SearchBar from "../SearchBar";

function TeamProjects(props) {
  const [search, setSearch] = useState("");

  return (
    <React.Fragment>
      {props.projects && props.projects.length > 0
        ? props.search === ""
          ? props.projects.map((project) => {
              if (project.archived === false) {
                return (
                  <ProjectPreview
                    project={project}
                    key={project._id}
                    teamProject={true}
                    getTeam={props.getTeam}
                  />
                );
              }
            })
          : props.projects.map((project) => {
              if (
                project.name.toLowerCase().indexOf(props.search.toLowerCase()) >
                  -1 &&
                project.archived === false
              )
                return (
                  <ProjectPreview
                    project={project}
                    key={project._id}
                    teamProject={true}
                    getTeam={props.getTeam}
                  />
                );
            })
        : props.isLoading === false && (
            <div className="team__no-projects">
              <p>No projects found</p>
            </div>
          )}
    </React.Fragment>
  );
}

const mapDispatchToProps = {
  clearCurrentSectionAndId,
  setTeamUpdated,
  setErrors,
  getUserTeams,
};

const mapStateToProps = (state) => ({
  currentId: state.user.currentId,
  teamUpdated: state.teams.teamUpdated,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TeamProjects));
