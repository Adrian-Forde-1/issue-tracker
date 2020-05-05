import React, { Component } from 'react';
import axios from 'axios';

//Redux
import { connect } from 'react-redux';

//Actions
import { setErrors } from '../../redux/actions/userActions';

//Components
import SideNav from '../Navigation/SideNav';
import ProjectsTeamsHamburger from '../Navigation/ProjectsTeamsHamburger';

class EditProject extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      name: '',
      description: '',
      project: {},
    };
  }

  componentDidMount() {
    const projectId = this.props.match.params.projectId;
    axios
      .get(`/api/project/${projectId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        this.setState({
          name: response.data.name,
          description: response.data.description,
          project: response.data,
        });
      })
      .catch((error) => {
        this.props.setErrors(error);
        this.props.history.goBack();
      });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const project = {
      name: this.state.name,
      description: this.state.description,
    };

    axios
      .put(
        `/api/project/${this.props.match.params.projectId}`,
        { project: project },
        { headers: { Authorization: localStorage.getItem('token') } }
      )
      .then(() => {
        this.props.history.goBack();
      })
      .catch((error) => {
        this.props.setErrors(error);
        this.props.history.goBack();
      });
  };
  render() {
    return (
      <div>
        {Object.keys(this.state.project).length > 0 && (
          <div className="form-container no-top-nav ">
            <SideNav />
            <div className="container p-l-175-0">
              <div className="auth-form">
                <h2>Edit Project</h2>
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

                  <button className="submit-btn">Edit Project</button>
                </form>
              </div>
            </div>
            <ProjectsTeamsHamburger />
          </div>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = {
  setErrors,
};

export default connect(null, mapDispatchToProps)(EditProject);
