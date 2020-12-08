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

function AllTeamProjects(props) {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const teamId = props.match.params.teamId;
    console.log("Calling api");
    axios
      .get(`/api/team/projects/${teamId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((response) => {
        if (response && response.data) {
          console.log(response.data);
          setProjects(response.data);
        }
      })
      .catch((error) => {
        props.setErrors(error);
        props.clearCurrentSectionAndId();
      });

    props.getUserTeams(props.userId);
  }, []);

  // useEffect(() => {
  //   if (props.teamUpdated === true) {
  //     const teamId = props.match.params.teamId;

  //     axios
  //       .get(`/api/team/${teamId}`, {
  //         headers: { Authorization: localStorage.getItem("token") },
  //       })
  //       .then((response) => {
  //         const team = response.data;
  //         setProjects(team.projects);
  //       })
  //       .catch((error) => {
  //         props.setErrors(error);
  //         props.clearCurrentSectionAndId();
  //       });

  //     props.getUserTeams(props.userId);

  //     props.setTeamUpdated(false);
  //   }
  // }, [props.teamUpdated]);

  return (
    <div className="d-flex flex-column">
      {/* <SideNav /> */}
      {projects && projects.length > 0 && props.search === ""
        ? projects.map((project) => {
            if (project.archived === false) {
              return <ProjectPreview project={project} key={project._id} />;
            }
          })
        : projects.map((project) => {
            if (
              project.name.toLowerCase().indexOf(props.search.toLowerCase()) >
                -1 &&
              project.archived === false
            )
              return <ProjectPreview project={project} key={project._id} />;
          })}
    </div>
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
  projects: state.projects.projects,
  teamUpdated: state.teams.teamUpdated,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AllTeamProjects));
