import React from 'react';
import ReactDOM from 'react-dom';

//Components
import DeleteModal from './DeleteModal';

//React Router DOM
import { withRouter } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//Actions
import { setCurrentId, setCurrentSection } from '../redux/actions/userActions';

function ProjectPreview(props) {
  const { project } = props;
  return (
    <div className="preview">
      {/* <Link to={`/project/${project._id}`}>
        <h6>{project.name}</h6>
      </Link> */}

      <button
        onClick={() => {
          props.setCurrentSection('project');
          props.setCurrentId(project._id);
        }}
      >
        {project.name}
      </button>

      <i className="fas fa-archive"></i>
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

const mapDispatchToProps = {
  setCurrentSection,
  setCurrentId,
};

export default connect(null, mapDispatchToProps)(withRouter(ProjectPreview));
