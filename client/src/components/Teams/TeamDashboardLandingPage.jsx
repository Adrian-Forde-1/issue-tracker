import React, { useEffect } from "react";

//React Router DOM
import { Link } from "react-router-dom";

//SVG
import TeamworkSVG from "../SVG/TeamworkSVG";

const TeamDashboardLandingPage = (props) => {
  useEffect(() => {
    if (props && props.setCurrentTeam) {
      props.setCurrentTeam("");
    }
  }, []);
  return (
    <div className="team__dashboard-landing-wrapper">
      <TeamworkSVG />
      <h6>Try creating a team or joining one</h6>
      <div>
        <Link to="/team/create">Create Team</Link>
        <Link to="/team/join">Join Team</Link>
      </div>
    </div>
  );
};

export default TeamDashboardLandingPage;
