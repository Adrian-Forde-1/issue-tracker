import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

//Components
import DeleteModal from '../DeleteModal';

//React Router DOM
import { withRouter, Link } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//Actions
import { setErrors } from '../../redux/actions/userActions';

import {
  getUserProjects,
  setProjects,
} from '../../redux/actions/projectActions';

import { getUserTeams, setTeamUpdated } from '../../redux/actions/teamActions';

function ProjectPreview(props) {
  const { project } = props;
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
                if (project.group) {
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

      <i
        className="far fa-trash-alt delete-btn"
        onClick={() => {
          const element = document.createElement('div');
          element.classList.add('modal-element');
          document.querySelector('#modal-root').appendChild(element);
          ReactDOM.render(
            <DeleteModal
              item={project}
              type={'project'}
              groupId={project.group}
            />,
            element
          );
        }}
      ></i>
    </div>
  );
}

const mapDispatchToProps = {
  setErrors,
  getUserProjects,
  setProjects,
  getUserTeams,
  setTeamUpdated,
};

export default connect(null, mapDispatchToProps)(withRouter(ProjectPreview));
