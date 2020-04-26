import React, { Component } from 'react';
import { generateColor } from '../util/generateColor';
import axios from 'axios';

//Components
import GoBack from './GoBack';

//Redux
import store from '../redux/store';
import { connect } from 'react-redux';

//Actions
import { getUserProjects } from '../redux/actions/projectActions';
import { setCurrentSection } from '../redux/actions/userActions';
import { SET_MESSAGES, SET_ERRORS } from '../redux/actions/types';

class EditLabel extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.sendRequest = this.sendRequest.bind(this);

    this.state = {
      name: '',
      color: '#0989AC',
    };
  }

  componentDidMount() {
    const projectId = this.props.currentId;
    const labelId = this.props.extraIdInfo;
    const project = store
      .getState()
      .projects.projects.find(
        (project) => project._id.toString() === projectId.toString()
      );

    const label = project.labels.find(
      (label) => label._id.toString() === labelId.toString()
    );

    this.setState(
      {
        name: label.name,
        color: label.color,
      },
      () => {
        document.querySelector(
          '.show-color'
        ).style.background = `${this.state.color}`;
      }
    );
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  sendRequest = (e) => {
    e.preventDefault();

    const projectId = this.props.currentId;
    const labelId = this.props.extraIdInfo;

    const label = {
      name: this.state.name,
      color: this.state.color,
    };

    axios
      .put(
        `/api/project/${projectId}/label/${labelId}/edit`,
        { label: label },
        { headers: { Authorization: localStorage.getItem('token') } }
      )
      .then((response) => {
        store.dispatch({ type: SET_MESSAGES, payload: response.data });
        store
          .dispatch(getUserProjects(localStorage.getItem('token')))
          .then(() => {
            this.props.setCurrentSection('project/labels');
          });
      })
      .catch((error) => {
        store.dispatch({ type: SET_ERRORS, payload: error });
        this.props.setCurrentSection('project/labels');
      });
  };
  render() {
    const showColor = () => {
      const getColor = generateColor();

      this.setState(
        {
          color: getColor,
        },
        () => {
          document.querySelector(
            '.show-color'
          ).style.background = `${this.state.color}`;
        }
      );
    };
    return (
      <div className="form-container no-top-nav">
        <GoBack section="project/labels" id={this.props.currentId} />
        <div className="container">
          <div className="auth-form">
            <h2>Edit Label</h2>
            <div className="form-group">
              <label htmlFor="name">Label Name</label>
              <input
                type="text"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </div>
            <div className="w-50 d-flex justify-content-center mx-auto">
              <button className="color-picker mr-2" onClick={showColor}>
                Generate Color <i className="fas fa-sync-alt"></i>
              </button>
              <div className="show-color"></div>
            </div>
            <button className="submit-btn" onClick={this.sendRequest}>
              Edit Label
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setCurrentSection,
};

const mapStateToProps = (state) => ({
  currentId: state.user.currentId,
  extraIdInfo: state.user.extraIdInfo,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditLabel);
