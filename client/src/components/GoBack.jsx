import React from 'react';

//Redux
import { connect } from 'react-redux';
//Actions
import {
  setCurrentSection,
  setCurrentId,
  clearCurrentSectionAndId,
} from '../redux/actions/userActions';

function GoBack(props) {
  return (
    <div
      className="go-back"
      onClick={() => {
        if (props.id === '' && props.section === '')
          props.clearCurrentSectionAndId();
        else {
          props.setCurrentSection(props.section);
          props.setCurrentId(props.id);
        }
      }}
    >
      <i className="fas fa-arrow-alt-circle-left"></i>
    </div>
  );
}

const mapStateToProps = (state) => ({
  currentId: state.user.currentId,
});

const mapDispatchToProps = {
  setCurrentSection,
  setCurrentId,
  clearCurrentSectionAndId,
};

export default connect(mapStateToProps, mapDispatchToProps)(GoBack);
