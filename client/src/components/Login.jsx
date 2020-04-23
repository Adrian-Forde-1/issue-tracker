import React, { Component } from 'react';

//Tostify
import { toast } from 'react-toastify';

//React Router Dom
import { Link } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//Actions
import {
  loginUser,
  clearErrors,
  clearMessages,
} from '../redux/actions/userActions';

class Login extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      email: '',
      password: '',
    };
  }

  componentDidMount() {
    if (this.props.authenticated === true)
      this.props.history.replace('/manager');
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password,
    };

    this.props.loginUser(user, this.props.history);
  };

  render() {
    if (this.props.authenticated === false) {
      return (
        <div className="form-container">
          <div className="container">
            {this.props.messages !== null &&
              this.props.messages['user'] &&
              !toast.isActive('usertoast') &&
              toast(this.props.messages.user, {
                toastId: 'usertoast',
                type: 'success',
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                onClose: () => {
                  this.props.clearMessages();
                },
              })}
            {this.props.errors !== null &&
              this.props.errors['general'] &&
              !toast.isActive('toast') &&
              toast(this.props.errors.general, {
                toastId: 'toast',
                type: 'error',
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                onClose: () => {
                  this.props.clearErrors();
                },
              })}
            {this.props.errors !== null &&
              this.props.errors['user'] &&
              !toast.isActive('usertoast') &&
              toast(this.props.errors.user, {
                toastId: 'usertoast',
                type: 'error',
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                onClose: () => {
                  this.props.clearErrors();
                },
              })}
            <div className="auth-form">
              <h2>
                <Link to="/">Login</Link>
              </h2>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <br />
                  <input
                    type="email"
                    name="email"
                    value={this.state.email}
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
                <button className="submit-btn">Login</button>
              </form>
              <p>
                Dont have an account? <Link to="/signUp">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapDispatchToProps = {
  loginUser,
  clearErrors,
  clearMessages,
};

const mapStateToProps = (state) => ({
  errors: state.user.errors,
  messages: state.user.messages,
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
