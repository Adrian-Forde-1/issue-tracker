import React, { useEffect, useState } from 'react';
import axios from 'axios';

//Tostify
import { toast } from 'react-toastify';

//Components
import LabelPreview from './LabelPreview';
import GoBack from './GoBack';

//Redux
import { connect } from 'react-redux';

//Actions
import {
  clearErrors,
  setCurrentSection,
  setCurrentId,
} from '../redux/actions/userActions';

function Labels(props) {
  const [project, setProject] = useState({});
  const projectId = props.currentId;

  useEffect(() => {
    axios
      .get(`/api/project/${projectId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        setProject(response.data);
      });
  }, [props.projects]);
  return (
    <div className="labels">
      <GoBack section="project" id={props.currentId} />
      <h2>Labels</h2>
      {props.errors !== null &&
        props.errors['label'] &&
        !toast.isActive('labeltoast') &&
        toast(props.errors.label, {
          toastId: 'labeltoast',
          type: 'error',
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          onClose: () => {
            props.clearErrors();
          },
        })}
      {Object.keys(project).length > 0 &&
        project.labels.map((label, index) => (
          <LabelPreview
            label={label}
            index={index}
            projectId={project._id}
            key={index}
          />
        ))}
      <i
        className="fas fa-plus-square action-btn add-label"
        onClick={() => {
          props.setCurrentSection('project/label/create');
          props.setCurrentId(props.currentId);
        }}
      ></i>
    </div>
  );
}

const mapDispatchToProps = {
  clearErrors,
  setCurrentSection,
  setCurrentId,
};

const mapStateToProps = (state) => ({
  projects: state.projects.projects,
  errors: state.user.errors,
  currentId: state.user.currentId,
});

export default connect(mapStateToProps, mapDispatchToProps)(Labels);
