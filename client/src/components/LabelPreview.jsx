import React, { useEffect } from 'react';
import axios from 'axios';

//Redux
import store from '../redux/store';

//Actiosn
import { getUserProjects } from '../redux/actions/projectActions';

//React Router DOM
import { withRouter, Link } from 'react-router-dom';

function LabelPreview(props) {
  const { label, index, projectId } = props;

  useEffect(() => {
    document.querySelector(
      `#label${index} div`
    ).style.background = `${label.color}`;
  }, []);

  const deleteLabel = () => {
    axios
      .delete(`/api/project/${projectId}/label/${label._id}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then(() => {
        store.dispatch(getUserProjects(localStorage.getItem('token')));
        props.history.push(`/project/${projectId}/labels`);
      });
  };
  return (
    <div className="label-preview" id={`label${index}`}>
      <div>
        <p>{label.name}</p>
      </div>

      <Link to={`/project/${projectId}/label/${label._id}/edit`}>
        <i className="far fa-edit"></i>
      </Link>
      <i className="far fa-trash-alt" onClick={deleteLabel}></i>
    </div>
  );
}

export default withRouter(LabelPreview);
