import React, { useEffect, useState } from 'react';
import axios from 'axios';

//React Router DOM
import { withRouter } from 'react-router-dom';

//Redux
import store from '../redux/store';

//Actions
import { getUserGroups } from '../redux/actions/groupActions';
import { SET_ERRORS } from '../redux/actions/types';

//Components
import ProjectPreview from './ProjectPreview';

function AllGroupProjects(props) {
  const [projects, changeProjects] = useState([]);

  useEffect(() => {
    const groupId = props.match.params.groupId;

    axios
      .get(`/api/group/${groupId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        const group = response.data;
        changeProjects(group.projects);
      })
      .catch((error) => {
        store.dispatch({ type: SET_ERRORS, payload: error });
      });

    store.dispatch(getUserGroups(props.userId));
  }, []);

  return (
    <div className="item-row" id="projects">
      {projects && projects.length > 0 && props.search === ''
        ? projects.map((project) => (
            <ProjectPreview project={project} key={project._id} />
          ))
        : projects.map((project) => {
            if (
              project.name.toLowerCase().indexOf(props.search.toLowerCase()) >
              -1
            )
              return <ProjectPreview project={project} key={project._id} />;
          })}
    </div>
  );
}

export default withRouter(AllGroupProjects);
