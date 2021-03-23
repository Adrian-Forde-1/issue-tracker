import React from "react";

//Components
import TeamManagementSectionUser from "./TeamManagementSectionUser";

const TeamManagementSection = ({
  sectionHeader = "",
  users = [],
  teamLeaderId = "",
  sectionLength = 0,
  canEditUsers = false,
  teamManagementInfo,
  updateUserRole,
}) => {
  return (
    <div className="team__management-section">
      <div className="team__management-section__header">
        <h4>
          {sectionHeader === "Users" ? "Members" : sectionHeader}
          {teamLeaderId !== "" && ` - ${sectionLength}`}
        </h4>
      </div>
      {Array.isArray(users) && users.length > 0 ? (
        <table className="team__management-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) &&
              users.length > 0 &&
              users.map((user, userIndex) => (
                <tr key={userIndex}>
                  <td>
                    <div>{user.username}</div>
                  </td>
                  <td>
                    <div>{sectionHeader.toString().toLowerCase()}</div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <div className="team__management-section__empty">
          There are no {sectionHeader}
        </div>
      )}

      {/* {Array.isArray(users) && users.length > 0 ? (
        users.map((user, userIndex) => {
          if (user._id.toString() !== teamLeaderId)
            return (
              <TeamManagementSectionUser
                user={user}
                key={userIndex}
                editable={canEditUsers}
                updateUserRole={updateUserRole}
                teamManagementInfo={teamManagementInfo}
                index={userIndex}
                sectionHeader={sectionHeader.toString().toLowerCase()}
              />
            );
        })
      ) : (
        <div className="team__management-section__empty">
          There are no {sectionHeader}
        </div>
      )} */}
    </div>
  );
};

export default TeamManagementSection;
