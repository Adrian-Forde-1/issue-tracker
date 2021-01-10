import React from "react";
import { Link, withRouter } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//Actions
// import { logoutUser } from "../../redux/actions/userActions";

//Util
import { logoutUser } from "../../util/authUtil";

//SVG
import HamburgerNavSVG from "../SVG/HamburgerNavSVG";

const DashboardNavbar = (props) => {
  const renderImage = () => {
    if (props && props.user) {
      if (props.user.image && props.user.image !== null) {
        return <img src={props.user.image}></img>;
      }
      return (
        <span>
          {props.user.username &&
            props.user.username.toString().toUpperCase()[0]}
        </span>
      );
    }
  };

  if (props && props.user) {
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
                    logoutUser(props.history);
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
  } else return null;
};

const mapDispatchToProps = {
  // logoutUser,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  user: state.user.user,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DashboardNavbar));
