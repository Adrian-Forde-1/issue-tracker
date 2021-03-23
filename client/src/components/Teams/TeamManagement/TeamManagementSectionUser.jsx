import React from "react";

//Redux
// import { connect } from "react-redux";

const TeamManagementSectionUser = ({
  user,
  editable,
  index,
  updateUserRole,
  sectionHeader,
  teamManagementInfo,
}) => {
  return (
    <div className="team__management-section__user-container">
      <div className="team__management-section__user">
        {user.username ? user.username : "-"}
      </div>
      <div className="team__management-section__user-role">
        <select
          name=""
          id=""
          disabled={!editable}
          value={sectionHeader}
          onChange={(e) => {
            updateUserRole(sectionHeader, index, e.target.value);
          }}
        >
          {/* <option value="">Leader</option> */}
          <option value="admins">Admin</option>
          <option value="users">Member</option>
        </select>
      </div>
    </div>
  );
};

export default TeamManagementSectionUser;
