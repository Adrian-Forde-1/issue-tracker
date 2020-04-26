import React, { Component } from 'react';
import axios from 'axios';

//Components
import GoBack from './GoBack';

//Redux
import store from '../redux/store';
import { connect } from 'react-redux';

//Actions
import { SET_MESSAGES, SET_ERRORS } from '../redux/actions/types';
import { getUserProjects } from '../redux/actions/projectActions';
import { setCurrentId, setCurrentSection } from '../redux/actions/userActions';

class NewBug extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      project: {},
      name: '',
      description: '',
      label: '',
    };
  }

  componentDidMount() {
    const projectId = this.props.currentId;

    axios
      .get(`/api/project/${projectId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        const responseProject = response.data;
        var initialLabel = null;
        if (responseProject.labels.length > 0) {
          initialLabel = responseProject.labels[0].name;
        }

        this.setState({
          project: responseProject,
          label: initialLabel,
        });
      })
      .catch((error) => {
        store.dispatch({ type: SET_ERRORS, payload: error });
        this.props.setCurrentId(this.props.currentId);
        this.props.setCurrentSection('project');
      });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const label = this.state.project.labels.find(
      (label) => label.name.toString() === this.state.label.toString()
    );

    const bug = {
      name: this.state.name,
      description: this.state.description,
      label: label,
      projectId: this.state.project._id,
    };

    axios
      .post(
        '/api/bug',
        { bug: bug },
        { headers: { Authorization: localStorage.getItem('token') } }
      )
      .then((response) => {
        store.dispatch({ type: SET_MESSAGES, payload: response.data });
        store
          .dispatch(getUserProjects(localStorage.getItem('token')))
          .then(() => {
            this.props.setCurrentId(this.props.currentId);
            this.props.setCurrentSection('project');
          });
      })
      .catch((error) => {
        store.dispatch({ type: SET_ERRORS, payload: error });
        this.props.setCurrentId(this.props.currentId);
        this.props.setCurrentSection('project');
      });
  };
  render() {
    return (
      <div className="form-container no-top-nav">
        <GoBack section="project" />
        <div className="container">
          <div className="auth-form">
            <h2>New Bug</h2>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <br />
                <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <br />
                <textarea
                  type="text"
                  name="description"
                  maxLength="500"
                  value={this.state.description}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="label">Label</label>
                <br />
                <select
                  type="text"
                  name="label"
                  value={this.state.label}
                  onChange={this.handleChange}
                  required
                >
                  {this.state.project.labels &&
                    this.state.project.labels.map((label, index) => (
                      <option value={label.name} key={index}>
                        {label.name}
                      </option>
                    ))}
                </select>
              </div>
              <button className="submit-btn">Add Bug</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setCurrentId,
  setCurrentSection,
};

const mapStateToProps = (state) => ({
  currentSection: state.user.currentSection,
  currentId: state.user.currentId,
});

export default connect(mapStateToProps, mapDispatchToProps)(NewBug);
