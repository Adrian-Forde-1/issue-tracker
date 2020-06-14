import React, { useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';

//Resources
import bugLogoWhite from '../../resources/Images/Bug_Logo_White.svg';

function SideNav(props) {
  useEffect(() => {
    if (props.location.pathname.indexOf('project') > -1)
      document.querySelector('#project-link').classList.add('selected-section');
    if (props.location.pathname.indexOf('team') > -1) {
      document
        .querySelector('#project-link')
        .classList.remove('selected-section');
      document.querySelector('#team-link').classList.add('selected-section');
    }
    if (
      props.location.pathname.indexOf('team') > -1 &&
      props.location.pathname.indexOf('chat') > -1
    ) {
      document
        .querySelector('#project-link')
        .classList.remove('selected-section');
      document.querySelector('#team-link').classList.remove('selected-section');
      document
        .querySelector('#chatroom-link')
        .classList.add('selected-section');
    }
  }, []);
  return (
    <div className="side-nav">
      <Link to="/">
        <img src={bugLogoWhite} alt="" />
      </Link>
      <ul>
        <li id="project-link">
          <Link to="/projects">Projects</Link>
        </li>
        <li id="team-link">
          <Link to="/teams">Teams</Link>
        </li>
      </ul>
    </div>
  );
}

{
  /* <li id="chatroom-link">
          <Link to="/teams/chat">Chatroom</Link>
        </li> */
}

export default withRouter(SideNav);
