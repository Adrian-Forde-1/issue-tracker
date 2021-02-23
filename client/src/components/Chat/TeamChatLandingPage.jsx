import React, { useEffect } from "react";

//React Router
import { Link } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//SVG
import TeamChatSVG from "../SVG/TeamChatSVG";

function TeamChatLandingPage(props) {
  useEffect(() => {
    if (props.setCurrentTeam) props.setCurrentTeam("");
  }, []);
  return (
    <div className="chat__dashboard">
      <TeamChatSVG />
      <h6>Join a team to start chatting</h6>
      <div>
        <Link to="/team/join">Join Team</Link>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  teams: state.teams.teams,
});

export default connect(mapStateToProps)(TeamChatLandingPage);
