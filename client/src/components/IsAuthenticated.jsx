import React, { useEffect } from 'react';

//React Router DOM
import { withRouter } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

function IsAuthenticated(props) {
  useEffect(() => {
    props.authenticated === false && props.history.replace('/login');
  }, [props.user]);

  return <div>{props.children}</div>;
}

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(withRouter(IsAuthenticated));
