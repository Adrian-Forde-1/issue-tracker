import React from 'react';

//React Router DOM
import { withRouter } from 'react-router-dom';

function GoBack(props) {
  return (
    <div
      className="go-back"
      onClick={() => {
        props.history.goBack();
      }}
    >
      <i className="fas fa-arrow-left"></i>
    </div>
  );
}

export default withRouter(GoBack);
