import React, { useEffect, useState } from 'react';

//Redux
import store from '../redux/store';

//Actions
import { getUserProjects } from '../redux/actions/projectActions';

//Components
import ProjectPreview from './ProjectPreview';

function AllProjects(props) {
  const [projects, changeProjects] = useState([]);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      changeProjects(store.getState().projects.projects);
    });

    store.dispatch(getUserProjects(props.userId));

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="d-flex flex-column">
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

export default AllProjects;
