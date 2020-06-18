import React, { Component } from 'react';
import axios from 'axios';

//Redux
import { connect } from 'react-redux';

//Actions
import { setErrors } from '../../redux/actions/userActions';

import { getUserTeams } from '../../redux/actions/teamActions';

//Components
import SideNav from '../Navigation/SideNav';
import ProjectsTeamsHamburger from '../Navigation/ProjectsTeamsHamburger';

class CreateTeam extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      name: '',
      password: '',
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    var teamName = this.state.name;
    teamName = teamName.charAt(0).toUpperCase() + teamName.slice(1);

    const team = {
      name: teamName,
      password: this.state.password,
    };

    axios
      .post(
        '/api/team',
        { team: team },
        {
          headers: { Authorization: localStorage.getItem('token') },
        }
      )
      .then(() => {
        this.props.getUserTeams(localStorage.getItem('token'));
        this.props.history.goBack();
      })
      .catch((error) => {
        this.props.history.goBack();
      });
  };
  render() {
    return (
      <div>
        <ProjectsTeamsHamburger />
        <SideNav />
        <div className="form-container p-t-0">
          <div className="container p-l-175">
            <div className="auth-form">
              <h2>Create Team</h2>
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
                  <label htmlFor="password">Password</label>
                  <br />
                  <input
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                </div>
                <button className="submit-btn">Create Team</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setErrors,
  getUserTeams,
};

export default connect(null, mapDispatchToProps)(CreateTeam);
