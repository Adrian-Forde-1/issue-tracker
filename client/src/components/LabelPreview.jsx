import React, { useEffect } from 'react';
import axios from 'axios';

//Redux
import store from '../redux/store';
import { connect } from 'react-redux';

//Actiosn
import { getUserProjects } from '../redux/actions/projectActions';
import {
  setCurrentSection,
  setExtraIdInfo,
} from '../redux/actions/userActions';

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
        props.setCurrentSection('project/labels');
      });
  };
  return (
    <div className="label-preview" id={`label${index}`}>
      <div>
        <p>{label.name}</p>
      </div>

      <div className="label-preview-actions">
        <i
          className="far fa-edit"
          onClick={() => {
            props.setCurrentSection('project/label/edit');
            props.setExtraIdInfo(label._id);
          }}
        ></i>

        <i className="far fa-trash-alt" onClick={deleteLabel}></i>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  setCurrentSection,
  setExtraIdInfo,
};

export default connect(null, mapDispatchToProps)(LabelPreview);
