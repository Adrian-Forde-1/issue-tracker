import React, { Component } from 'react';

//React Router Dom
import { Link } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//Actions
import { signUpUser } from '../redux/actions/userActions';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.usernameRef = React.createRef();

    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
  }

  componentDidMount() {
    if (this.props.authenticated === true) this.props.history.goBack();
    this.usernameRef.current.focus();
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
    };

    this.props.signUpUser(user, this.props.history);
  };
  render() {
    if (this.props.authenticated === false) {
      return (
        <div className="form-container">
          <div className="container">
            <div className="auth-form">
              <h2>Sign Up</h2>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <br />
                  <input
                    type="text"
                    name="username"
                    maxLength="25"
                    required
                    value={this.state.username}
                    ref={this.usernameRef}
                    onChange={this.handleChange}
                  />
                  {this.props.errors.username && (
                    <div className="form-input-error">
                      {this.props.errors.username}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <br />
                  <input
                    type="email"
                    name="email"
                    required
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                  {this.props.errors.email && (
                    <div className="form-input-error">
                      {this.props.errors.email}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <br />
                  <input
                    type="password"
                    name="password"
                    minLength="6"
                    required
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                  {this.props.errors.password && (
                    <div className="form-input-error">
                      {this.props.errors.password}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <br />
                  <input
                    type="password"
                    name="confirmPassword"
                    minLength="6"
                    required
                    value={this.state.confirmPassword}
                    onChange={this.handleChange}
                  />
                  {this.props.errors.confirmPassword && (
                    <div className="form-input-error">
                      {this.props.errors.confirmPassword}
                    </div>
                  )}
                </div>
                <button className="submit-btn">Sign Up</button>
              </form>
              <p>
                Already have an account? <Link to="/login">Login</Link>
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
  signUpUser,
};

const mapStateToProps = (state) => ({
  errors: state.user.errors,
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
