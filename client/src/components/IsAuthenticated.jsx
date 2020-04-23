import React, { useEffect } from 'react';

//React Router DOM
import { withRouter } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

function IsAuthenticated(props) {
  useEffect(() => {
    props.user === null && props.history.replace('/login');
  }, [props.user]);

  return <div>{props.children}</div>;
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(withRouter(IsAuthenticated));
