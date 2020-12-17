import React from "react";
import { Link, withRouter } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//Actions
import { logoutUser } from "../../redux/actions/userActions";

//SVG
import HamburgerNavSVG from "../SVG/HamburgerNavSVG";

const DashboardNavbar = (props) => {
  const renderImage = () => {
    if (props.user.image && props.user.image !== null) {
      return <img src={props.user.image}></img>;
    }
    return <span>{props.user.username.toString().toUpperCase()[0]}</span>;
  };

  return (
    <div className="dashboard-navbar">
      <ul className="dashboard-navbar__nav-list">
        <div
          className="dashboard-navbar__hamburger-container"
          onClick={() => {
            props.setSidebarOpen(!props.sidebarOpen);
          }}
        >
          <HamburgerNavSVG />
        </div>
        <div className="dashboard-navbar__right-container">
          <div
            className="dashboard-navbar__profile-pic"
            onClick={() => {
              if (document.querySelector("#navbar-dropdown")) {
                document
                  .querySelector("#navbar-dropdown")
                  .classList.toggle("open");
              }
            }}
          >
            {renderImage()}
          </div>
          <div
            className="dashboard-navbar__right-dropdown"
            id="navbar-dropdown"
          >
            <div className="dashboard-navbar__right-dropdown__account-info">
              <div className="dashboard-navbar__right-dropdown__account-info-left">
                <div className="dashboard-navbar__right-dropdown__account-info-left__profile-pic">
                  {renderImage()}
                </div>
              </div>
              <div className="dashboard-navbar__right-dropdown__account-info-right">
                <span>{props.user.username}</span>
                <span>{props.user.email}</span>
              </div>
            </div>
            <ul>
              <li
                onClick={() => {
                  props.history.push("/profile");
                }}
              >
                Profile
              </li>
              <li
                onClick={() => {
                  props.logoutUser(props.history);
                }}
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      </ul>
    </div>
  );
};

// {navOpen ? (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       aria-hidden="true"
//       focusable="false"
//       width="1em"
//       height="1em"
//       className="hamburger"
//       preserveAspectRatio="xMidYMid meet"
//       viewBox="0 0 36 36"
//     >
//       <path
//         className="clr-i-outline clr-i-outline-path-1"
//         d="M19.41 18l8.29-8.29a1 1 0 0 0-1.41-1.41L18 16.59l-8.29-8.3a1 1 0 0 0-1.42 1.42l8.3 8.29l-8.3 8.29A1 1 0 1 0 9.7 27.7l8.3-8.29l8.29 8.29a1 1 0 0 0 1.41-1.41z"
//         fill="currentColor"
//       />
//     </svg>
//   ) : (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       aria-hidden="true"
//       focusable="false"
//       width="1em"
//       height="1em"
//       className="hamburger"
//       preserveAspectRatio="xMidYMid meet"
//       viewBox="0 0 50 50"
//     >
//       <path d="M10 12h30v4H10z" fill="currentColor" />
//       <path d="M10 22h30v4H10z" fill="currentColor" />
//       <path d="M10 32h30v4H10z" fill="currentColor" />
//     </svg>
//   )}

const mapDispatchToProps = {
  logoutUser,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  user: state.user.user,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DashboardNavbar));
