import React from 'react';

function ProjectsGroupsHamburger() {
  return (
    <i
      className="fas fa-caret-square-right projects-groups-hamburger"
      onClick={() => {
        document
          .querySelector('.projects-groups-hamburger')
          .classList.toggle('nav-open');
        document.querySelector('.side-nav').classList.toggle('nav-open');
      }}
    ></i>
  );
}

export default ProjectsGroupsHamburger;
