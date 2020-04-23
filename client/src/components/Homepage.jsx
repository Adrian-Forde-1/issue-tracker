import React, { useEffect } from 'react';

//React Router Dom
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

function Homepage(props) {
  useEffect(() => {
    if (props.authenticated === true) props.history.replace('/manager');
  });
  if (props.authenticated === false) {
    return (
      <div className="homepage">
        <div className="container">
          <div className="header-content">
            <div className="row">
              <div className="col-12">
                <h1>Bug Tracker</h1>
                <h5>Made By Adrian Forde</h5>
                <p>
                  With this bug tracker, you are able to create individual
                  projects and add labels to the bugs that you create in each
                  project. You are also able to create new labels and add notes
                  to each bug as a way of keeping up to data with the progress
                  being made to fix the bug. A bug can be set from new bug to
                  work in progress to fixed as a way to indicated what stage the
                  bug is in. There is a simple implementation of groups for
                  multiple people to work together
                </p>
                <Link to="/login" className="call-to-action">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(Homepage);
