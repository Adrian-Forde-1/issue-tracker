import React, { useState } from "react";

//Resources
import bugLogo from "../../resources/Images/Bug_Logo.svg";

//React Router DOM
import { Link, withRouter } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//Actions
import { logoutUser } from "../../redux/actions/userActions";

//Components
import NavbarLogoSVG from "../SVG/NavbarLogoSVG";

function Navbar(props) {
  const { authenticated } = props;
  const [navOpen, setNavOpen] = useState(false);

  const toggleNavbar = () => {
    document.querySelector(".hamburger").classList.toggle("nav-open");
    document.querySelector(".nav-list").classList.toggle("nav-open");
    setNavOpen(!navOpen);
  };
  if (
    props.location.pathname === "/" ||
    props.location.pathname === "/login" ||
    props.location.pathname === "/signup"
  ) {
    return (
      <div className="navbar">
        <Link to="/" className="logo">
          <NavbarLogoSVG classes={"navbar__logo"} />
        </Link>
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
        {/* <i
          className="fas fa-bars hamburger"
          onClick={() => {
            document.querySelector('.hamburger').classList.toggle('nav-open');
            document.querySelector('.nav-list').classList.toggle('nav-open');
          }}
        ></i> */}
        <ul className="nav-list">
          {/* <li className="nav-item">
            <Link to="/aboutus">About Us</Link>
          </li>
          <li className="nav-item">
            <Link to="/pricing">Pricing</Link>
          </li> */}
          {authenticated === false && (
            <li className="nav-item">
              <Link to="/login">Login</Link>
            </li>
          )}
          {authenticated === false && (
            <li className="nav-item">
              <Link to="/signup">Sign Up</Link>
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
