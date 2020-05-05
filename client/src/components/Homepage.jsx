import React from 'react';

//React Router Dom
import { Link } from 'react-router-dom';

//Resources
import Bug_Tracker_Homepage_Image from '../resources/Images/Bug_Tracker_Homepage_Image.svg';
import Wave_Bottom from '../resources/Images/Wave_Bottom.svg';

import { connect } from 'react-redux';

function Homepage(props) {
  return (
    <header>
      <div className="container">
        <div className="header-content">
          <div className="header-bottom-graphic">
            <div>
              <img src={Wave_Bottom} alt="" />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              {props.authenticated === false && (
                <div>
                  <div className="mt-5"></div>
                  <h1>
                    Managing bugs <br /> was <span>never easier</span>
                  </h1>
                  <p>
                    Create, manage and document your progress on fixing those
                    nasty bugs in your app. Cooperate with a team to solve
                    problems at a faster pace
                  </p>
                  <div className="header-links">
                    <Link to="/signup" className="main-header-link">
                      Try for free <i className="fas fa-arrow-right"></i>
                    </Link>
                    {/* <Link to="/signup">
                      <span>or</span> Login
                    </Link> */}
                  </div>
                </div>
              )}
              {props.authenticated === true && (
                <div>
                  <div className="mt-5"></div>
                  <h1>
                    Welcome
                    <br /> <span>{props.user.username}</span>.
                  </h1>
                  <p>
                    Hope you're able to solve those troublesome bugs today. Wish
                    you all the best.
                  </p>
                  <div className="header-links">
                    <Link to="/projects" className="main-header-link">
                      Projects
                    </Link>
                    <Link to="/teams" className="main-header-link">
                      Teams
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div className="mt-5"></div>
              <img
                src={Bug_Tracker_Homepage_Image}
                alt="Man with hammmer infront computer indicating he is going to fix something"
                className="img-fluid header-img"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(Homepage);
