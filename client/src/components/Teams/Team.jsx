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
import TeamProjects from "./TeamProjects";
import SearchBar from "../SearchBar";
import Spinner from "../Misc/Spinner/Spinner";

function Team(props) {
  const [team, setTeam] = useState({});
  const [search, setSearch] = useState("");
  const [teamId, setTeamId] = useState(props.match.params.teamId);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (props.match.params.teamId) setTeamId(props.match.params.teamId);
  }, [props.match.params]);

  useEffect(() => {
    if (teamId !== null) getTeam();
  }, [teamId]);

  const getTeam = () => {
    setTeam({});
    axios
      .get(`/api/team/projects/${teamId}`)
      .then((response) => {
        if (response.data) {
          setTeam(response.data);
        }
        props.setCurrentTeam(teamId);
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
          props.history.replace("/team/404");
        } else {
          props.history.goBack();
        }
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

  const renderActionBar = () => {
    if (
      (team.createdBy &&
        props.user &&
        Object.keys(props.user).length > 0 &&
        team.createdBy.toString() === props.user._id.toString()) ||
      (props.user &&
        team.admins &&
        Object.keys(props.user).length > 0 &&
        Array.isArray(team.admins) &&
        team.admins.findIndex(
          (admin) => admin.toString() === props.user._id.toString()
        ) > -1)
    ) {
      return (
        <div className="team__action-bar">
          <Link to={`/team/management/${teamId}`}>Manage Team</Link>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="team__profile-wrapper">
      {Object.keys(team).length > 0 ? (
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
                {team.name && team.name}{" "}
                {team.createdBy &&
                props.user &&
                props.user._id &&
                team.createdBy.toString() === props.user._id.toString() ? (
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
                            props.history.replace("/team");
                          })
                          .catch((error) => {
                            props.setErrors(error);
                            props.history.push("/team");
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
          <>{renderActionBar()}</>

          <div className="team__search-bar-container">
            <SearchBar
              onChange={handleSearchChange}
              search={search}
              extraClass="search-extra-info"
            />
          </div>
          <div className="team__projects">
            <TeamProjects
              search={search}
              teamId={teamId}
              setIsLoading={setIsLoading}
              projects={team.projects}
              getTeam={getTeam}
              isLoading={isLoading}
            />
          </div>
        </React.Fragment>
      ) : isLoading ? (
        <Spinner />
      ) : null}
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
