import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";

//Redux
import { connect } from "react-redux";

//Actions
import { setErrors } from "../../../redux/actions/userActions";

//Components
import Spinner from "../../Misc/Spinner/Spinner";
import TeamManagementSection from "./TeamManagementSection";

const TeamManagement = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [teamManagementInfo, setTeamManagementInfo] = useState({});
  const [initialTeamManagementInfo, setInitialTeamManagementInfo] = useState(
    {}
  );

  useEffect(() => {
    if (props.user && props.user._id && props.match.params.teamId)
      getTeamManagementInfo();
    else setIsLoading(false);
  }, []);

  const getTeamManagementInfo = () => {
    setIsLoading(true);
    axios
      .get(`/api/team/management/${props.match.params.teamId}`)
      .then((res) => {
        console.log(res.data);
        if (res && res !== null && res.data) {
          setTeamManagementInfo(res.data);
          setInitialTeamManagementInfo(res.data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (err && err.response && err.response.data) props.setErrors(err);
        setIsLoading(false);
      });
  };

  const canEditUsers = (groupType) => {
    if (props.user && Object.keys(props.user).length) {
      if (
        teamManagementInfo[groupType].findIndex(
          (admin) => admin._id.toString() === props.user._id.toString()
        ) > -1 ||
        teamManagementInfo.createdBy._id.toString() ===
          props.user._id.toString()
      )
        return true;
      return false;
    }
    return false;
  };

  const updateUserRole = (currentUserRole, userIndex, value) => {
    let updatedTeamManagementInfo = { ...teamManagementInfo };
    console.log("User Index:", userIndex);
    let userInArray = updatedTeamManagementInfo[currentUserRole].splice(
      userIndex,
      1
    );
    if (userInArray.length > 0) {
      let user = userInArray[0];
      updatedTeamManagementInfo[value].push(user);
      setTeamManagementInfo(updatedTeamManagementInfo);
    }
  };

  if (teamManagementInfo && Object.keys(teamManagementInfo).length > 0) {
    return (
      <div className="team__wrapper">
        <div className="team__management-section__heading">
          <h2>View Team</h2>
        </div>
        {/* <div className="team__management-section">
          <div className="team__management-section__header">
            <h4>Leader</h4>
          </div>
          <div className="team__management-section__user-container">
            <div className="team__management-section__user">
              {teamManagementInfo.createdBy
                ? teamManagementInfo.createdBy.username
                : "-"}
            </div>
            <div className="team__management-section__user-role">
              <span>Leader</span>
            </div>
          </div>
        </div> */}
        <div className="team__management-section__wrapper">
          <TeamManagementSection
            sectionHeader="Leader"
            users={new Array(teamManagementInfo.createdBy)}
            teamLeaderId=""
            updateUserRole={updateUserRole}
            teamManagementInfo={teamManagementInfo}
            canEditUsers={
              props.user &&
              Object.keys(props.user).length > 0 &&
              teamManagementInfo.createdBy._id.toString() ===
                props.user._id.toString()
            }
            sectionLength={teamManagementInfo.admins.length}
          />
          {/* <TeamManagementSection
            sectionHeader="Admins"
            users={teamManagementInfo.admins.filter(
              (user) =>
                user._id.toString() !==
                teamManagementInfo.createdBy._id.toString()
            )}
            teamLeaderId={teamManagementInfo.createdBy._id.toString()}
            updateUserRole={updateUserRole}
            teamManagementInfo={teamManagementInfo}
            canEditUsers={
              props.user &&
              Object.keys(props.user).length > 0 &&
              teamManagementInfo.createdBy._id.toString() ===
                props.user._id.toString()
            }
            sectionLength={teamManagementInfo.admins.length}
          /> */}
          <TeamManagementSection
            sectionHeader="Users"
            users={teamManagementInfo.users.filter(
              (user) =>
                user._id.toString() !==
                teamManagementInfo.createdBy._id.toString()
            )}
            teamLeaderId={teamManagementInfo.createdBy._id.toString()}
            updateUserRole={updateUserRole}
            teamManagementInfo={teamManagementInfo}
            canEditUsers={canEditUsers("admins")}
            sectionLength={
              teamManagementInfo.users.filter(
                (user) =>
                  user._id.toString() !==
                  teamManagementInfo.createdBy._id.toString()
              ).length
            }
          />
        </div>
        {!_.isEqual(
          teamManagementInfo.users,
          initialTeamManagementInfo.users
        ) ||
          (!_.isEqual(
            teamManagementInfo.admins,
            initialTeamManagementInfo.admins
          ) && (
            <button className="team__management-section__update-btn">
              Save Changes
            </button>
          ))}
      </div>
    );
  } else if (isLoading) return <Spinner />;
  else return null;
};

const mapDispatchToProps = {
  setErrors,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(TeamManagement);
