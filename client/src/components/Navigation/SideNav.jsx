import React, { useEffect } from "react";
import { Link, withRouter } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//SVG
import LogoIconSVG from "../SVG/LogoIconSVG";
import TaskSVG from "../SVG/TaskSVG";
import PeopleSVG from "../SVG/PeopleSVG";

function SideNav(props) {
  useEffect(() => {
    if (props.location.pathname.indexOf("project") > -1)
      document.querySelector("#project-link").classList.add("selected-section");
    if (props.location.pathname.indexOf("team") > -1) {
      if (document.querySelector("#project-link"))
        document
          .querySelector("#project-link")
          .classList.remove("selected-section");

      if (document.querySelector("#team-link"))
        document.querySelector("#team-link").classList.add("selected-section");
    }
    if (
      props.location.pathname.indexOf("team") > -1 &&
      props.location.pathname.indexOf("chat") > -1
    ) {
      if (document.querySelector("#project-link"))
        document
          .querySelector("#project-link")
          .classList.remove("selected-section");

      if (document.querySelector("#team-link"))
        document.querySelector("#team-link").classList.add("selected-section");
    }
  }, []);

  return (
    <div className="side-nav">
      <div className="side-nav__top">
        <Link to="/">
          <LogoIconSVG />
        </Link>
      </div>
      <ul>
        <li id="project-link">
          <Link to="/project">
            <TaskSVG />
            <span>Projects</span>
          </Link>
        </li>
        <li id="team-link">
          <Link to="/team">
            <PeopleSVG /> <span>Teams</span>
          </Link>
        </li>
        {/* <li id="chatroom-link">
          <Link to="/teams/chat">
            <span>Team Chat</span>
          </Link>
        </li> */}
      </ul>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(withRouter(SideNav));
