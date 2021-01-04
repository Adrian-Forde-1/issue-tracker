import React, { useEffect, useState } from "react";
import axios from "axios";

//Tippy
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";

//React Router DOM
import { Link } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//Actions
import {
  clearErrors,
  setErrors,
  setCurrentSection,
  setCurrentId,
} from "../../redux/actions/userActions";

import { setProjects } from "../../redux/actions/projectActions";

import {
  showModal,
  setDeleteItem,
  setItemType,
  setCurrentLocation,
} from "../../redux/actions/modalActions";

//SVG
import ArchiveSVG from "../SVG/ArchiveSVG";
import PlusSVG from "../SVG/PlusSVG";

//Components
import AllTeamProjects from "./AllTeamProjects";
import SearchBar from "../SearchBar";

function Team(props) {
  const [team, setTeam] = useState({});
  const [search, setSearch] = useState("");
  const [teamId, setTeamId] = useState(props.match.params.teamId);

  useEffect(() => {
    if (props.match.params.teamId) setTeamId(props.match.params.teamId);
  }, [props.match.params]);

  useEffect(() => {
    getTeam();
  }, [teamId]);

  const getTeam = () => {
    axios
      .get(`/api/team/${teamId}`)
      .then((response) => {
        if (response.data) {
          setTeam(response.data);
        }
        props.setCurrentTeam(teamId);
      })
      .catch((error) => {
        props.setErrors(error);
        props.history.goBack();
      });
  };

  const handleSearchChange = (e) => {
    sessionStorage.setItem("project-search", e.target.value);
    setSearch(e.target.value);
  };

  const deleteModal = () => {
    props.setDeleteItem(team);
    props.setItemType("project");
    props.setCurrentLocation(props.history.location.pathname.split("/"));
    props.showModal();
  };

  return (
    <div className="team__profile-wrapper">
      {Object.keys(team).length > 0 && (
        <React.Fragment>
          <div className="team__header">
            <div className="team__img-container">
              {team.image ? (
                <img src="" alt="" />
              ) : (
                <div>
                  <span>{team.name.toString().toUpperCase()[0]}</span>
                </div>
              )}
            </div>
            <div className="team__header-content">
              {" "}
              <h2 className="team__name">
                {team.name}{" "}
                {team.createdBy.toString() === props.user._id.toString() ? (
                  <span>
                    <i className="far fa-trash-alt" onClick={deleteModal}></i>
                  </span>
                ) : (
                  <span>
                    <i
                      className="fas fa-door-open"
                      onClick={() => {
                        axios
                          .put(`/api/leave/team/${teamId}`, null)
                          .then(() => {
                            props.history.replace("/teams");
                          })
                          .catch((error) => {
                            props.setErrors(error);
                            props.history.push("/teams");
                          });
                      }}
                    ></i>
                  </span>
                )}
              </h2>
              <p className="team__id">
                <span>Id: </span>
                {team._id}
              </p>
            </div>
            <div className="team__header-actions-container">
              <div>
                <Link to={`/team/${teamId}/project/create`}>
                  <Tooltip title="Add project" position="bottom" size="small">
                    <PlusSVG />
                  </Tooltip>
                </Link>
              </div>
              {/* <div>
                <ArchiveSVG />
              </div> */}
            </div>
          </div>
          <div className="team__search-bar-container">
            <SearchBar
              onChange={handleSearchChange}
              search={search}
              extraClass="search-extra-info"
            />
          </div>
          <div className="team__projects">
            <AllTeamProjects search={search} teamId={teamId} />
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

const mapDispatchToProps = {
  setProjects,
  setErrors,
  clearErrors,
  setCurrentSection,
  setCurrentId,
  showModal,
  setDeleteItem,
  setItemType,
  setCurrentLocation,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  teams: state.teams.teams,
  errors: state.user.errors,
  currentId: state.user.currentId,
});

export default connect(mapStateToProps, mapDispatchToProps)(Team);
