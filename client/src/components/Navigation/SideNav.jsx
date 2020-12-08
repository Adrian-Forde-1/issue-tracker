import React, { useEffect } from "react";
import { Link, withRouter } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//SVG
import NavbarLogoSVG from "../SVG/NavbarLogoSVG";
import TaskSVG from "../SVG/TaskSVG";
import PeopleSVG from "../SVG/PeopleSVG";

function SideNav(props) {
  useEffect(() => {
    if (props.location.pathname.indexOf("project") > -1)
      document.querySelector("#project-link").classList.add("selected-section");
    if (props.location.pathname.indexOf("team") > -1) {
      document
        .querySelector("#project-link")
        .classList.remove("selected-section");
      document.querySelector("#team-link").classList.add("selected-section");
    }
    if (
      props.location.pathname.indexOf("team") > -1 &&
      props.location.pathname.indexOf("chat") > -1
    ) {
      document
        .querySelector("#project-link")
        .classList.remove("selected-section");
      document.querySelector("#team-link").classList.remove("selected-section");
      document
        .querySelector("#chatroom-link")
        .classList.add("selected-section");
    }
  }, []);

  return (
    <div className="side-nav">
      <div className="side-nav__top">
        <Link to="/">
          <NavbarLogoSVG />
        </Link>
      </div>
      <ul>
        <li id="project-link">
          <Link to="/projects">
            <TaskSVG />
            <span>Projects</span>
          </Link>
        </li>
        <li id="team-link">
          <Link to="/teams">
            <PeopleSVG /> Teams
          </Link>
        </li>
        <li id="chatroom-link">
          <Link to="/teams/chat">Team Chat</Link>
        </li>
      </ul>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(withRouter(SideNav));
