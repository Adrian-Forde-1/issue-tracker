import React, { useEffect } from 'react';
import axios from 'axios';

//React Router DOM
import { Link, withRouter } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//Actiosn
import { getUserProjects } from '../../redux/actions/projectActions';

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
        props.getUserProjects(localStorage.getItem('token'));
        props.history.replace(`/project/${projectId}/labels`);
      });
  };
  return (
    <div className="label-preview" id={`label${index}`}>
      <div>
        <p>{label.name}</p>
      </div>

      <div className="label-preview-actions">
        <Link to={`/project/${projectId}/label/${label._id}/edit`}>
          <i className="far fa-edit"></i>
        </Link>

        <i className="far fa-trash-alt" onClick={deleteLabel}></i>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  getUserProjects,
};

export default connect(null, mapDispatchToProps)(withRouter(LabelPreview));
