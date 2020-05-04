import React, { useEffect, useState } from 'react';
import axios from 'axios';

//Redux
import store from '../../redux/store';
import { connect } from 'react-redux';

//Actions
import { getUserGroups } from '../../redux/actions/groupActions';
import { clearCurrentSectionAndId } from '../../redux/actions/userActions';
import { SET_ERRORS } from '../../redux/actions/types';

//Components
import ProjectPreview from '../Preview/ProjectPreview';
import SearchBar from '../SearchBar';

function ArchivedGroupProjects(props) {
  const [projects, changeProjects] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const groupId = props.currentId;

    axios
      .get(`/api/group/${groupId}/projects/archived`, {
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
    const groupId = props.currentId;
    axios
      .get(`/api/group/${groupId}/projects/archived`, {
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
    <div className="individual-container">
      <div className="containers">
        <div className="search-and-filter">
          <SearchBar
            search={search}
            onChange={onChange}
            extraClass="search-extra-info"
          />
        </div>
        <h2 className="archived-project-name p-t-85">
          Archived Group Projects
        </h2>
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
