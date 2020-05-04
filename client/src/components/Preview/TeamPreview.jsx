import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

//Components
import DeleteModal from '../DeleteModal';

//React Router DOM
import { Link, withRouter } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//Actions
import {
  setCurrentId,
  setCurrentSection,
} from '../../redux/actions/userActions';
import { getUserTeams } from '../../redux/actions/teamActions';

function TeamPreview(props) {
  const { team } = props;
  return (
    <div className="preview">
      {/* <Link to={`/team/${team._id}`}>
        <h6>{team.name}</h6>
      </Link> */}

      <Link to={`/team/${team._id}`}>{team.name}</Link>

      {team.createdBy.toString() === props.user._id.toString() ? (
        <span className="margin-left-auto">
          <i
            className="far fa-trash-alt delete-btn"
            onClick={() => {
              const element = document.createElement('div');
              element.classList.add('modal-element');
              document.querySelector('#modal-root').appendChild(element);
              ReactDOM.render(
                <DeleteModal item={team} type={'team'} />,
                element
              );
            }}
          ></i>
        </span>
      ) : (
        <span className="margin-left-auto">
          <i
            className="fas fa-door-open delete-btn"
            onClick={() => {
              axios
                .put(`/api/leave/team/${team._id}`, null, {
                  headers: {
                    Authorization: localStorage.getItem('token'),
                  },
                })
                .then(() => {
                  props.getUserTeams(props.user._id);
                })
                .catch((error) => {
                  props.setErrors(error.response.data);
                  props.setCurrentSection('');
                  props.setCurrentId('');
                });
            }}
          ></i>
        </span>
      )}
    </div>
  );
}

const mapDispatchToProps = {
  setCurrentSection,
  setCurrentId,
  getUserTeams,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TeamPreview));
