import React, { useEffect } from "react";

//React Router DOM
import { Link } from "react-router-dom";

//SVG
import SittingNextToComputerSVG from "../SVG/SittingNextToComputerSVG";

const ProjectDashboardLandingPage = (props) => {
  useEffect(() => {
    if (props && props.setCurrentProject) {
      props.setCurrentProject("");
    }
  }, []);
  return (
    <div className="project__dashboard-landing-wrapper">
      <SittingNextToComputerSVG />
      <h6>Got a new Project? Try adding it here</h6>
      <Link to="/project/create">Create Project</Link>
    </div>
  );
};

export default ProjectDashboardLandingPage;
