import React from 'react';

//Resources
import bugLogo from '../resources/Images/Bug_Logo.svg';

//React Router DOM
import { Link, withRouter } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//Actions
import { logoutUser } from '../redux/actions/userActions';

function Navbar(props) {
  const { authenticated } = props;
  if (props.location.pathname !== '/manager') {
    return (
      <div className="navbar">
        <Link to="/" className="logo">
          <img src={bugLogo} alt="" /> <span>BUG </span> TRACKER
        </Link>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/aboutus">About Us</Link>
          </li>
          <li className="nav-item">
            <Link to="/pricing">Pricing</Link>
          </li>
          {authenticated === false ? (
            <li className="nav-item">
              <Link to="/signup">Sign Up</Link>
            </li>
          ) : (
            <li className="nav-item">
              <Link to="/manager">Manager</Link>
            </li>
          )}
          {authenticated === true && (
            <li className="nav-item">
              <button
                onClick={() => {
                  props.logoutUser(props.history);
                }}
              >
                Logout<i className="fas fa-door-open"></i>
              </button>
            </li>
          )}
        </ul>
      </div>
    );
  } else {
    return null;
  }
}

const mapDispatchToProps = {
  logoutUser,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navbar));
