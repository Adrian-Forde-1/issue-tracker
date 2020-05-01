import React, { useEffect, useState } from 'react';
import axios from 'axios';

//Components
import ProjectPreview from './ProjectPreview';
import GoBack from './GoBack';

//Redux
import { connect } from 'react-redux';

//Actions
import {
  setErrors,
  clearCurrentSectionAndId,
} from '../redux/actions/userActions';
import SearchBar from './SearchBar';

function ArchivedProjects(props) {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios
      .get(`/api/projects/archived`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        props.clearCurrentSectionAndId();
        props.setErrors(error);
      });
  }, []);

  const onChange = (e) => {
    setSearch(e.target.value);
  };

  const resetProjects = () => {
    axios
      .get(`/api/projects/archived`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        props.clearCurrentSectionAndId();
        props.setErrors(error);
      });
  };

  return (
    <div className="individual-container">
      <GoBack section="" id="" />
      <div className="containers">
        <div className="search-and-filter">
          <SearchBar
            search={search}
            onChange={onChange}
            extraClass="search-extra-info"
          />
        </div>
        <h2 className="archived-project-name p-t-85">Archived Projects</h2>
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
  setErrors,
  clearCurrentSectionAndId,
};

export default connect(null, mapDispatchToProps)(ArchivedProjects);
