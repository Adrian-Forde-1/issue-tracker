import React from "react";

//Components
import TeamManagementSectionUser from "./TeamManagementSectionUser";

const TeamManagementSection = ({
  sectionHeader = "",
  users = [],
  teamLeaderId = "",
  sectionLength = 0,
  canEditUsers = false,
}) => {
  return (
    <div className="team__management-section">
      <div className="team__management-section__header">
        <h4>
          {sectionHeader} - {sectionLength}
        </h4>
      </div>
      {Array.isArray(users) && users.length > 0 ? (
        users.map((user, userIndex) => {
          if (user._id.toString() !== teamLeaderId)
            return (
              <TeamManagementSectionUser
                user={user}
                key={userIndex}
                editable={canEditUsers}
              />
            );
        })
      ) : (
        <div className="team__management-section__empty">
          There are no {sectionHeader}
        </div>
      )}
    </div>
  );
};

export default TeamManagementSection;
