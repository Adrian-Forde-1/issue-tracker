import React from 'react';
import axios from 'axios';

//React Router DOM
import { withRouter, Link } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//Actions
import { setErrors } from '../../redux/actions/userActions';

import {
  showModal,
  setDeleteItem,
  setItemType,
  setCurrentLocation,
} from '../../redux/actions/modalActions';

import {
  getUserProjects,
  setProjects,
} from '../../redux/actions/projectActions';

import { getUserTeams, setTeamUpdated } from '../../redux/actions/teamActions';

function ProjectPreview(props) {
  const { project } = props;

  const deleteModal = () => {
    props.setDeleteItem(project);
    props.setItemType('project');
    props.setCurrentLocation(props.history.location.pathname.split('/'));
    props.showModal();
  };
  return (
    <div className="preview">
      {/* <Link to={`/project/${project._id}`}>
        <h6>{project.name}</h6>
      </Link> */}

      <Link to={`/project/${project._id}`}>{project.name}</Link>

      <i
        className={`fas fa-archive archive-btn ${props.extraIconClass}`}
        onClick={() => {
          if (project.archived === false) {
            axios
              .put(`/api/project/${project._id}/archive/add`, null, {
                headers: {
                  Authorization: localStorage.getItem('token'),
                },
              })
              .then(() => {
                if (project.team) {
                  props.setTeamUpdated(true);
                } else {
                  axios
                    .get(`/api/project/${project._id}`, {
                      headers: {
                        Authorization: localStorage.getItem('token'),
                      },
                    })
                    .then(() => {
                      props.getUserProjects(localStorage.getItem('token'));
                    })
                    .catch((error) => {
                      props.setErrors(error.response.data);
                      props.history.goBack();
                    });
                }
              })
              .catch((error) => {
                props.setErrors(error.response.data);
                props.history.location('/projects');
              });
          } else {
            axios
              .put(`/api/project/${project._id}/archive/remove`, null, {
                headers: {
                  Authorization: localStorage.getItem('token'),
                },
              })
              .then(() => {
                props.resetProjects();
              })
              .catch((error) => {
                props.setErrors(error);
                props.history.location('/projects/archived');
              });
          }
        }}
      ></i>

      <i className="far fa-trash-alt delete-btn" onClick={deleteModal}></i>
    </div>
  );
}

const mapDispatchToProps = {
  setErrors,
  getUserProjects,
  setProjects,
  getUserTeams,
  setTeamUpdated,
  showModal,
  setDeleteItem,
  setItemType,
  setCurrentLocation,
};

export default connect(null, mapDispatchToProps)(withRouter(ProjectPreview));
