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
                <h1>Tractor</h1>
                <h5>Bug Tracker</h5>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Eveniet assumenda ex ipsum quia nostrum porro. Ex odio
                  consequuntur nihil, voluptatum perspiciatis culpa. Facere eum
                  assumenda iste, veritatis natus delectus dolor?
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
