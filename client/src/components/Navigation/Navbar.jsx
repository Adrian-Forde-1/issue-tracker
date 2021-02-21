import React, { useState } from "react";

//Resources
import bugLogo from "../../resources/Images/Bug_Logo.svg";

//React Router DOM
import { Link, withRouter } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//Actions
// import { logoutUser } from "../../redux/actions/userActions";

//Util
import { logoutUser } from "../../util/authUtil";

//Components
import NavbarLogoSVG from "../SVG/NavbarLogoSVG";

// window.onclick = function (e) {
//   e.stopPropagation();
//   if (
//     document.querySelector("#navbar-dropdown") &&
//     document.querySelector("#navbar-dropdown").classList.contains("open")
//   ) {
//     document.querySelector("#navbar-dropdown").classList.remove("open");
//   }
// };

function Navbar(props) {
  const { authenticated } = props;
  const [navOpen, setNavOpen] = useState(false);

  const renderImage = () => {
    if (props && props.user && props.user.image && props.user.image !== null) {
      return <img src={props.user && props.user.image}></img>;
    }
    return (
      <span>
        {props.user && props.user.username.toString().toUpperCase()[0]}
      </span>
    );
  };

  const renderHamburger = () => {
    if (authenticated === false) {
      return (
        <>
          {navOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
              width="1em"
              height="1em"
              className="hamburger"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 36 36"
              onClick={toggleNavbar}
            >
              <path
                className="clr-i-outline clr-i-outline-path-1"
                d="M19.41 18l8.29-8.29a1 1 0 0 0-1.41-1.41L18 16.59l-8.29-8.3a1 1 0 0 0-1.42 1.42l8.3 8.29l-8.3 8.29A1 1 0 1 0 9.7 27.7l8.3-8.29l8.29 8.29a1 1 0 0 0 1.41-1.41z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
              width="1em"
              height="1em"
              className="hamburger"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 50 50"
              onClick={toggleNavbar}
            >
              <path d="M10 12h30v4H10z" fill="currentColor" />
              <path d="M10 22h30v4H10z" fill="currentColor" />
              <path d="M10 32h30v4H10z" fill="currentColor" />
            </svg>
          )}
        </>
      );
    }

    return null;
  };

  const toggleNavbar = () => {
    document.querySelector(".hamburger").classList.toggle("nav-open");
    document.querySelector(".nav-list").classList.toggle("nav-open");
    setNavOpen(!navOpen);
  };

  if (
    props.location.pathname === "/" ||
    props.location.pathname === "/login" ||
    props.location.pathname === "/signup" ||
    props.location.pathname === "/profile"
  ) {
    return (
      <div className="navbar">
        <Link to="/" className="logo">
          <NavbarLogoSVG classes={"navbar__logo"} />
        </Link>
        {renderHamburger()}
        {/* <i
          className="fas fa-bars hamburger"
          onClick={() => {
            document.querySelector('.hamburger').classList.toggle('nav-open');
            document.querySelector('.nav-list').classList.toggle('nav-open');
          }}
        ></i> */}
        {!authenticated && (
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/login">
                <span>Login</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/signup">
                <span>Sign Up</span>
              </Link>
            </li>
          </ul>
        )}
        {authenticated === true && (
          <div className="navbar__right-container">
            <div
              className="navbar__profile-pic"
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
            <div className="navbar__right-dropdown" id="navbar-dropdown">
              <div className="navbar__right-dropdown__account-info">
                <div className="navbar__right-dropdown__account-info-left">
                  <div className="navbar__right-dropdown__account-info-left__profile-pic">
                    {renderImage()}
                  </div>
                </div>
                <div className="navbar__right-dropdown__account-info-right">
                  <span>{props.user && props.user.username}</span>
                  <span>{props.user && props.user.email}</span>
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
        )}
      </div>
    );
  } else {
    return null;
  }
}

const mapDispatchToProps = {
  // logoutUser,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  user: state.user.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navbar));
