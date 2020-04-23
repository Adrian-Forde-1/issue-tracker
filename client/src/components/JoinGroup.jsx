import React, { Component } from 'react';
import axios from 'axios';

export class JoinGroup extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      id: '',
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

    const group = {
      groupId: this.state.id,
      password: this.state.password,
    };

    axios
      .post(
        '/api/join/group',
        { group: group },
        { headers: { Authorization: localStorage.getItem('token') } }
      )
      .then(() => {
        this.props.history.goBack();
      });
  };
  render() {
    return (
      <div className="form-container">
        <div className="container">
          <div className="auth-form">
            <h2>Join Group</h2>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="id">Id</label>
                <br />
                <input
                  type="text"
                  name="id"
                  value={this.state.id}
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
              <button className="submit-btn">Join Group</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default JoinGroup;
