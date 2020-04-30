import React from 'react';

//Redux
import { connect } from 'react-redux';
//Actions
import { setCurrentSection, setCurrentId } from '../redux/actions/userActions';

function GoBack(props) {
  return (
    <div
      className="go-back"
      onClick={() => {
        console.log(props.id);
        props.setCurrentSection(props.section);
        props.setCurrentId(props.id || props.currentId);
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
};

export default connect(mapStateToProps, mapDispatchToProps)(GoBack);
