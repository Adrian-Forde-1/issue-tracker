import React, { useEffect } from "react";

//SVG
import NoData from "../SVG/NoData";

const NotFound = (props) => {
  useEffect(() => {
    if (props.location.pathname.indexOf("project") > -1) {
      props.setCurrentProject("");
    } else {
      props.setCurrentTeam("");
    }
  }, []);
  return (
    <div className="not-found__wrapper">
      <NoData />
      <h6>Opps, Sorry! Couldn't find what you're looking for.</h6>
    </div>
  );
};

export default NotFound;
