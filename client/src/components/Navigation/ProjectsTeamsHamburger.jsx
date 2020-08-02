import React, { useState } from 'react';

//React Router
import { withRouter } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

function ProjectsTeamsHamburger(props) {
  const [navOpen, setNavOpen] = useState(false);
  const toggleNavOpen = (e) => {
    document
      .querySelector('.projects-teams-hamburger')
      .classList.toggle('nav-open');
    document.querySelector('.side-nav').classList.toggle('nav-open');

    setNavOpen(!navOpen);
  };

  return (
    <div
      className="projects-teams-hamburger"
      id="nav-hamburger"
      onClick={toggleNavOpen}
      style={{ cursor: 'pointer' }}
    >
      {navOpen ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          width="1em"
          height="1em"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 36 36"
          style={{ color: 'white', fontSize: '20px' }}
        >
          <path
            className="clr-i-outline clr-i-outline-path-1"
            d="M19.41 18l8.29-8.29a1 1 0 0 0-1.41-1.41L18 16.59l-8.29-8.3a1 1 0 0 0-1.42 1.42l8.3 8.29l-8.3 8.29A1 1 0 1 0 9.7 27.7l8.3-8.29l8.29 8.29a1 1 0 0 0 1.41-1.41z"
            fill="currentColor"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          width="1em"
          height="1em"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 50 50"
          style={{ color: 'white', fontSize: '20px' }}
        >
          <path d="M10 12h30v4H10z" fill="currentColor" />
          <path d="M10 22h30v4H10z" fill="currentColor" />
          <path d="M10 32h30v4H10z" fill="currentColor" />
        </svg>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(withRouter(ProjectsTeamsHamburger));
