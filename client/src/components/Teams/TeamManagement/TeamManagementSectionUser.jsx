import React from "react";

//Redux
// import { connect } from "react-redux";

const TeamManagementSectionUser = ({ user, editable }) => {
  return (
    <div className="team__management-section__user-container">
      {console.log("Editable: ", editable)}
      <div className="team__management-section__user">
        {user.username ? user.username : "-"}
      </div>
      <div className="team__management-section__user-role">
        <select name="" id="" disabled={!editable}>
          <option value="">Leader</option>
          <option value="">Admin</option>
          <option value="">Member</option>
        </select>
      </div>
    </div>
  );
};

export default TeamManagementSectionUser;
