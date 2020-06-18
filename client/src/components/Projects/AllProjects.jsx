import React, { useEffect, useState } from 'react';

//Tostify
import { toast } from 'react-toastify';

//Redux
import { connect } from 'react-redux';

//React Router DOM
import { Link } from 'react-router-dom';

//Actions
import { getUserProjects } from '../../redux/actions/projectActions';

//Components
import ProjectPreview from '../Preview/ProjectPreview';
import SearchBar from '../SearchBar';
import SideNav from '../Navigation/SideNav';
import ProjectsTeamsHamburger from '../Navigation/ProjectsTeamsHamburger';

function AllProjects(props) {
  const [projects, changeProjects] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    props.getUserProjects(localStorage.getItem('token'));
    changeProjects(props.projects);
  }, []);

  useEffect(() => {
    changeProjects(props.projects);
  }, [props.projects]);

  const onChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div
      className="d-flex flex-column p-l-175"
      style={{ position: 'relative' }}
    >
      <ProjectsTeamsHamburger />
      <div className="under-nav-section">
        <SearchBar search={search} onChange={onChange} />
        <div className="under-nav-section-links">
          <Link to="/create/project" className="action-btn">
            <i className="fas fa-plus-square "></i>
          </Link>
          <Link to={`/projects/archived`} className="action-btn extra-right">
            <i className="fas fa-archive "></i>
          </Link>
        </div>
      </div>

      <SideNav />
      {/* {props.errors !== null &&
        props.errors['project'] &&
        !toast.isActive('projecttoast') &&
        toast(props.errors.bug, {
          toastId: 'projecttoast',
          type: 'error',
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          onClose: () => {
            props.clearErrors();
          },
        })} */}
      <h3 className="section-title">Projects</h3>
      {projects && projects.length > 0 && search === ''
        ? projects.map((project) => {
            if (project.archived === false)
              return <ProjectPreview project={project} key={project._id} />;
          })
        : projects.map((project) => {
            if (
              project.name.toLowerCase().indexOf(search.toLowerCase()) > -1 &&
              project.archived === false
            )
              return <ProjectPreview project={project} key={project._id} />;
          })}
    </div>
  );
}

const mapDispatchToProps = {
  getUserProjects,
};

const mapStateToProps = (state) => ({
  projects: state.projects.projects,
  errors: state.user.errors,
});

export default connect(mapStateToProps, mapDispatchToProps)(AllProjects);
