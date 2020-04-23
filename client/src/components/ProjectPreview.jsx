import React from 'react';
import ReactDOM from 'react-dom';

//Components
import DeleteModal from './DeleteModal';

//React Router DOM
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

function ProjectPreview(props) {
  const { project } = props;
  return (
    <div className="preview">
      <Link to={`/project/${project._id}`}>
        <h2>{project.name}</h2>
        <br />
        <p>{project.description}</p>
      </Link>
      <button
        className="delete-btn"
        onClick={() => {
          const element = document.createElement('div');
          element.classList.add('modal-element');
          document.querySelector('#modal-root').appendChild(element);
          ReactDOM.render(
            <DeleteModal item={project} type={'project'} history={null} />,
            element
          );
        }}
      >
        <i className="far fa-trash-alt"></i>
      </button>
    </div>
  );
}

export default withRouter(ProjectPreview);
