import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
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

//Components
import AllTeamProjects from './AllTeamProjects';
import DeleteModal from '../DeleteModal';
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
                  <i
                    className="far fa-trash-alt"
                    onClick={() => {
                      const element = document.createElement('div');
                      element.classList.add('modal-element');
                      document
                        .querySelector('#modal-root')
                        .appendChild(element);
                      ReactDOM.render(
                        <DeleteModal item={team} type={'team'} />,
                        element
                      );
                    }}
                  ></i>
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
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  teams: state.teams.teams,
  errors: state.user.errors,
  currentId: state.user.currentId,
});

export default connect(mapStateToProps, mapDispatchToProps)(IndividualTeam);
