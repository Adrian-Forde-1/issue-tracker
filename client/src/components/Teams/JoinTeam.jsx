import React, { Component } from 'react';
import axios from 'axios';

//Tostify
import { toast } from 'react-toastify';

//Redux
import { connect } from 'react-redux';

//Actions
import { setErrors } from '../../redux/actions/userActions';

//Components
import SideNav from '../Navigation/SideNav';

class JoinGroup extends Component {
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
        this.props.history.push('/groups');
      })
      .catch((error) => {
        this.props.setErrors(error);
      });
  };
  render() {
    return (
      <div className="form-container p-t-0">
        {this.props.errors !== null &&
          this.props.errors['group'] &&
          !toast.isActive('grouptoast') &&
          toast(this.props.errors.bug, {
            toastId: 'grouptoast',
            type: 'error',
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
            onClose: () => {
              this.props.clearErrors();
            },
          })}
        <SideNav />
        <div className="container p-l-175">
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
                {this.props.errors.password && (
                  <div className="form-input-error">
                    {this.props.errors.password}
                  </div>
                )}
              </div>
              <button className="submit-btn">Join Group</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setErrors,
};

const mapStateToProps = (state) => ({
  errors: state.user.errors,
});

export default connect(mapStateToProps, mapDispatchToProps)(JoinGroup);
