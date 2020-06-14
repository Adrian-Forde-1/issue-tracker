import React, { useEffect, useState } from 'react';
import axios from 'axios';

//Tostify
import { toast } from 'react-toastify';

//React Router DOM
import { Link } from 'react-router-dom';

//Components
import SearchBar from '../SearchBar';

//Redux
import { connect } from 'react-redux';

//Actions
import {
  clearErrors,
  setErrors,
  setCurrentSection,
  setCurrentId,
} from '../../redux/actions/userActions';

import { setProjects } from '../../redux/actions/projectActions';

import {
  showModal,
  setDeleteItem,
  setItemType,
  setCurrentLocation,
} from '../../redux/actions/modalActions';

//Components
import AllTeamProjects from './AllTeamProjects';
import ProjectsTeamsHamburger from '../Navigation/ProjectsTeamsHamburger';

function IndividualTeam(props) {
  const [team, setTeam] = useState({});
  const [search, setSearch] = useState('');
  const teamId = props.match.params.teamId;

  useEffect(() => {
    axios
      .get(`/api/team/${teamId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        setTeam(response.data);
      })
      .catch((error) => {
        props.setErrors(error);
        props.history.goBack();
      });
  }, []);

  const handleSearchChange = (e) => {
    sessionStorage.setItem('project-search', e.target.value);
    setSearch(e.target.value);
  };

  const deleteModal = () => {
    props.setDeleteItem(team);
    props.setItemType('team');
    props.setCurrentLocation(props.history.location.pathname.split('/'));
    props.showModal();
  };

  return (
    <div className="individual-container">
      <Link to={`/team/${team._id}/project/create`} className="action-btn">
        <i className="fas fa-plus-square "></i>
      </Link>
      <Link
        to={`/team/${team._id}/archived`}
        className="action-btn extra-right"
      >
        <i className="fas fa-archive "></i>
      </Link>
      <div className="containers">
        <div className="search-and-filter">
          <SearchBar
            onChange={handleSearchChange}
            search={search}
            extraClass="search-extra-info"
          />
        </div>
        {props.errors !== null &&
          props.errors['project'] &&
          !toast.isActive('projecttoast') &&
          toast(props.errors.project, {
            toastId: 'projecttoast',
            type: 'error',
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
            onClose: () => {
              props.clearErrors();
            },
          })}
        {Object.keys(team).length > 0 && (
          <div>
            <h2 className="team-name">
              {team.name}{' '}
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
                        .put(`/api/leave/team/${teamId}`, null, {
                          headers: {
                            Authorization: localStorage.getItem('token'),
                          },
                        })
                        .then(() => {
                          props.history.replace('/teams');
                        })
                        .catch((error) => {
                          props.setErrors(error);
                          props.history.push('/teams');
                        });
                    }}
                  ></i>
                </span>
              )}
            </h2>
            <p className="team-id">
              <span>Id: </span>
              {team._id}
            </p>

            <AllTeamProjects search={search} />
          </div>
        )}
      </div>
      <ProjectsTeamsHamburger />
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

export default connect(mapStateToProps, mapDispatchToProps)(IndividualTeam);
