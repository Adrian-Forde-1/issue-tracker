import React, { useEffect, useState } from 'react';

//Redux
import { connect } from 'react-redux';

//Actions
import { getUserProjects } from '../../redux/actions/projectActions';

//Components
import ProjectPreview from '../Preview/ProjectPreview';

function AllProjects(props) {
  const [projects, changeProjects] = useState([]);

  useEffect(() => {
    changeProjects(props.projects);
  }, []);
  useEffect(() => {
    changeProjects(props.projects);
  }, [props.projects]);

  return (
    <div className="d-flex flex-column">
      {console.log(projects)}
      {projects && projects.length > 0 && props.search === ''
        ? projects.map((project) => {
            if (project.archived === false)
              return <ProjectPreview project={project} key={project._id} />;
          })
        : projects.map((project) => {
            if (
              project.name.toLowerCase().indexOf(props.search.toLowerCase()) >
                -1 &&
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
});

export default connect(mapStateToProps, mapDispatchToProps)(AllProjects);
