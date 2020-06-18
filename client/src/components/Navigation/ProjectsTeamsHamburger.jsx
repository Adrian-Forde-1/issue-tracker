import React from 'react';

//React Router
import { withRouter } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

function ProjectsTeamsHamburger(props) {
  const toggleNavOpen = (e) => {
    document
      .querySelector('.projects-teams-hamburger')
      .classList.toggle('nav-open');
    document.querySelector('.side-nav').classList.toggle('nav-open');

    if (e.target.parentElement.classList.contains('nav-open')) {
      e.target.classList.remove('fa-bars');
      e.target.classList.add('fa-times');
    } else {
      e.target.classList.remove('fa-times');
      e.target.classList.add('fa-bars');
    }
  };

  return (
    <div className="projects-teams-hamburger">
      <i className="fas fa-bars" onClick={toggleNavOpen}></i>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(withRouter(ProjectsTeamsHamburger));
