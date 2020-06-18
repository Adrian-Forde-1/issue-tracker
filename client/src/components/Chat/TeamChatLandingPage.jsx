import React from 'react';

//React Router
import { Link } from 'react-router-dom';

//Resources
import group_chat_image from '../../resources/Images/group_chat_image.svg';

//Redux
import { connect } from 'react-redux';
import SideNav from '../Navigation/SideNav';
import ProjectsTeamsHamburger from '../Navigation/ProjectsTeamsHamburger';

function TeamChatLandingPage(props) {
  return (
    <div>
      <ProjectsTeamsHamburger />
      <SideNav />
      <div className="container team-chat-landing-page">
        <div className="img-container">
          <img src={group_chat_image} alt="" />
          {props.user.teams.length > 0 ? (
            <h5>Select a team to start chating</h5>
          ) : (
            <h5>Join a team to start chating</h5>
          )}
          {props.user.teams.length > 0 && (
            <div className="team-chat-landing-page-user-teams">
              <ul className="list-group">
                {props.user.teams.map((team, i) => (
                  <li className="list-group-item" key={i}>
                    <Link to={`/teams/chat/${team._id}`}>{team.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(TeamChatLandingPage);
