import React, { Component } from 'react';
import axios from 'axios';

//Components
import GoBack from './GoBack';

//Redux
import { connect } from 'react-redux';

//Actions
import { setErrors, setCurrentSection } from '../redux/actions/userActions';

class CreateGroupProject extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      name: '',
      description: '',
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const groupId = this.props.currentId;

    const project = {
      name: this.state.name,
      description: this.state.description,
      groupId,
    };

    axios
      .post(
        '/api/project',
        { project: project },
        {
          headers: { Authorization: localStorage.getItem('token') },
        }
      )
      .then(() => {
        this.props.setCurrentSection('group');
      })
      .catch((error) => {
        this.props.setErrors(error.response.data);
        this.props.setCurrentSection('group');
      });
  };
  render() {
    return (
      <div className="form-container no-top-nav">
        <GoBack section="group" id={this.props.currentId} />
        <div className="container">
          <div className="auth-form">
            <h2>Create Project</h2>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <br />
                <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleChange}
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
                />
              </div>
              <button className="submit-btn">Create Project</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setErrors,
  setCurrentSection,
};

const mapStateToProps = (state) => ({
  currentId: state.user.currentId,
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroupProject);
