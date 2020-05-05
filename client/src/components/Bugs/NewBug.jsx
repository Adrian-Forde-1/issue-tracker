import React, { Component } from 'react';
import axios from 'axios';

//Redux
import { connect } from 'react-redux';

//React Router DOM
import { withRouter } from 'react-router-dom';

//Actions
import { SET_MESSAGES, SET_ERRORS } from '../../redux/actions/types';
import { getUserProjects } from '../../redux/actions/projectActions';
import {
  setCurrentId,
  setCurrentSection,
  setErrors,
} from '../../redux/actions/userActions';

//Components
import SideNav from '../Navigation/SideNav';
import ProjectsTeamsHamburger from '../Navigation/ProjectsTeamsHamburger';

class NewBug extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      project: {},
      name: '',
      description: '',
      labels: [],
    };
  }

  componentDidMount() {
    const projectId = this.props.match.params.projectId;

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
        this.props.setErrors(error);
        this.props.setCurrentId(this.props.currentId);
        this.props.setCurrentSection('project');
      });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleCheckBoxChange = (e) => {
    if (e.target.checked) {
      const label = this.state.project.labels.find(
        (label) => label.name.toString() === e.target.value.toString()
      );
      const newLabels = [...this.state.labels, label];
      this.setState({
        labels: newLabels,
      });
    } else {
      const newLabels = this.state.labels.filter(
        (label) => label.name.toString() !== e.target.value.toString()
      );
      this.setState({
        labels: newLabels,
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const bug = {
      name: this.state.name,
      description: this.state.description,
      labels: this.state.labels,
      projectId: this.state.project._id,
    };

    axios
      .post(
        '/api/bug',
        { bug: bug },
        { headers: { Authorization: localStorage.getItem('token') } }
      )
      .then(() => {
        this.props.getUserProjects(localStorage.getItem('token'));
        this.props.history.goBack();
      })
      .catch((error) => {
        this.props.setErrors(error);
        this.props.setCurrentId(this.props.currentId);
        this.props.setCurrentSection('project');
      });
  };
  render() {
    return (
      <div className="form-container">
        <SideNav />
        <div className="container p-l-175">
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
              {this.state.project.labels &&
                this.state.project.labels.map((label, index) => (
                  <div className="form-check" key={index}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      value={label.name}
                      id={`check${index}`}
                      onChange={this.handleCheckBoxChange}
                    />
                    <label
                      htmlFor={`check${index}`}
                      className="form-check-label check-label"
                      style={{ background: `${label.color}`, color: 'white' }}
                    >
                      {label.name}
                    </label>
                  </div>
                ))}
              <button className="submit-btn">Add Bug</button>
            </form>
          </div>
        </div>
        <ProjectsTeamsHamburger />
      </div>
    );
  }
}

const mapDispatchToProps = {
  setCurrentId,
  setCurrentSection,
  setErrors,
  getUserProjects,
};

const mapStateToProps = (state) => ({
  currentSection: state.user.currentSection,
  currentId: state.user.currentId,
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NewBug));
