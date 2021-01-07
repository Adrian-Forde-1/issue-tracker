import React from "react";

//React Router Dom
import { Link } from "react-router-dom";

//Resources
import Bug_Tracker_Homepage_Image from "../resources/Images/Bug_Tracker_Homepage_Image.svg";

import { connect } from "react-redux";

function Homepage(props) {
  return (
    <header>
      <div className="container">
        <div className="header-content">
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
                      Try for free
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                        width="1em"
                        height="1em"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 16 16"
                        style={{ marginLeft: "10px", fontSize: "20px" }}
                      >
                        <g fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10.146 4.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L12.793 8l-2.647-2.646a.5.5 0 0 1 0-.708z"
                          />
                          <path
                            fillRule="evenodd"
                            d="M2 8a.5.5 0 0 1 .5-.5H13a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8z"
                          />
                        </g>
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
              {props.authenticated === true && (
                <div>
                  <div className="mt-5"></div>
                  <h1>
                    Welcome
                    <br /> <span>{props.user && props.user.username}</span>.
                  </h1>
                  <p>
                    Hope you're able to solve those troublesome bugs today. Wish
                    you all the best.
                  </p>
                  <div className="header-links">
                    <Link to="/project" className="main-header-link">
                      Projects
                    </Link>
                    <Link to="/team" className="main-header-link">
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
            {props.authenticated === false && (
              <div className="col-12 premade-accounts">
                <h4>Premade Accounts</h4>
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Password</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>user1@email.com</td>
                      <td>user1password</td>
                    </tr>
                    <tr>
                      <td>user2@email.com</td>
                      <td>user2password</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
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
