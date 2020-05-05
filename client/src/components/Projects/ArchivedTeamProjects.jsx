import React, { useEffect, useState } from 'react';
import axios from 'axios';

//Redux
import store from '../../redux/store';
import { connect } from 'react-redux';

//Actions
import { getUserGroups } from '../../redux/actions/teamActions';
import { clearCurrentSectionAndId } from '../../redux/actions/userActions';
import { SET_ERRORS } from '../../redux/actions/types';

//Components
import ProjectPreview from '../Preview/ProjectPreview';
import SearchBar from '../SearchBar';
import SideNav from '../Navigation/SideNav';
import ProjectsGroupsHamburger from '../Navigation/ProjectsGroupsHamburger';

function ArchivedGroupProjects(props) {
  const [projects, changeProjects] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const teamId = props.match.params.teamId;

    axios
      .get(`/api/team/${teamId}/projects/archived`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        changeProjects(response.data);
      })
      .catch((error) => {
        store.dispatch({ type: SET_ERRORS, payload: error });
        props.clearCurrentSectionAndId();
      });
  }, []);

  const resetProjects = () => {
    const teamId = props.match.params.teamId;
    axios
      .get(`/api/team/${teamId}/projects/archived`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        changeProjects(response.data);
      })
      .catch((error) => {
        store.dispatch({ type: SET_ERRORS, payload: error });
        props.clearCurrentSectionAndId();
      });
  };

  const onChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div
      className="d-flex flex-column p-l-175"
      style={{ position: 'relative' }}
    >
      <ProjectsGroupsHamburger />
      <SideNav />
      <SearchBar search={search} onChange={onChange} />
      <h3 className="section-title">Archived Team Projects</h3>

      {projects && projects.length > 0 && search === ''
        ? projects.map((project) => {
            if (project.archived === true)
              return (
                <ProjectPreview
                  project={project}
                  key={project._id}
                  extraIconClass="remove-archive-sign"
                  resetProjects={resetProjects}
                />
              );
          })
        : projects.map((project) => {
            if (
              project.name.toLowerCase().indexOf(search.toLowerCase()) > -1 &&
              project.archived === true
            )
              return <ProjectPreview project={project} key={project._id} />;
          })}
    </div>
  );
}

const mapDispatchToProps = {
  clearCurrentSectionAndId,
};

const mapStateToProps = (state) => ({
  currentId: state.user.currentId,
  projects: state.projects.projects,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArchivedGroupProjects);
