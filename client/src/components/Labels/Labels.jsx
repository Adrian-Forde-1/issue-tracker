import React, { useEffect, useState } from 'react';
import axios from 'axios';

//Tostify
import { toast } from 'react-toastify';

//React Router DOM
import { Link } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//Actions
import { clearErrors } from '../../redux/actions/userActions';

//Components
import LabelPreview from '../Preview/LabelPreview';
import SideNav from '../Navigation/SideNav';
import ProjectsGroupsHamburger from '../Navigation/ProjectsGroupsHamburger';

function Labels(props) {
  const [project, setProject] = useState({});
  const projectId = props.match.params.projectId;

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
    <div className="labels p-l-175-0">
      <ProjectsGroupsHamburger />
      <SideNav />
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
      <Link to={`/project/${project._id}/label/add`}>
        <i className="fas fa-plus-square action-btn add-label"></i>
      </Link>
    </div>
  );
}

const mapDispatchToProps = {
  clearErrors,
};

const mapStateToProps = (state) => ({
  projects: state.projects.projects,
  errors: state.user.errors,
});

export default connect(mapStateToProps, mapDispatchToProps)(Labels);
