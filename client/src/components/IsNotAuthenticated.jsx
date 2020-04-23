import React, { useEffect } from 'react';

//React Router DOM
import { withRouter } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

function IsNotAuthenticated(props) {
  useEffect(() => {
    Object.keys(props.user).length > 0 && props.history.push('/manager');
  }, [props.user]);

  return <div>{props.children}</div>;
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(withRouter(IsNotAuthenticated));
