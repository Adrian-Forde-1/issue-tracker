import React, { useEffect, useState } from "react";

//Axios
import axios from "axios";

//Tostify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Axios
import { setErrors, logoutUser } from "./redux/actions/userActions";

//React Router Dom
import { Route, withRouter, Switch } from "react-router-dom";

//Components
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import IsAuthenticated from "./components/IsAuthenticated";
import Navbar from "./components/Navigation/Navbar";
import { connect } from "react-redux";
import ProjectDashboard from "./components/Projects/ProjectDashboard";
import ArchivedProjects from "./components/Projects/ArchivedProjects";
import ArchivedTeamProjects from "./components/Projects/ArchivedTeamProjects";
import TeamChat from "./components/Chat/TeamChat";
import ErrorBoundary from "./components/ErrorBoundary";
import TeamChatLandingPage from "./components/Chat/TeamChatLandingPage";
import ToastComponent from "./components/Toast/ToastComponent";
import Profile from "./components/Profile/Profile";
import TeamDashboard from "./components/Teams/TeamDashboard";

const App = (props) => {
  // toast.configure({
  //   position: toast.POSITION.TOP_CENTER,
  //   autoClose: 4000,

  // });
  const [refreshTokenInterval, setRefreshTokenInterval] = useState(null);

  useEffect(() => {
    if (
      props.user &&
      Object.keys(props.user).length > 0 &&
      props.authenticated
    ) {
      //
      let user = {
        _id: props.user._id,
      };
      setRefreshTokenInterval(
        setInterval(() => {
          axios.post("/api/token", { user }).catch((err) => {
            if (
              err &&
              err.response.status === 401 &&
              props.authenticated === true
            )
              props.logoutUser();
            if (err && err.response && err.response.data) props.setErrors(err);
          });
        }, 10 * 1000)
      );
    } else {
      clearInterval(refreshTokenInterval);
    }
  }, [props.user, props.authenticated]);

  return (
    <div className="App">
      <ToastContainer />
      <Navbar />
      <ToastComponent />
      {/* <Breadcrumbs /> */}
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/profile" component={Profile} />

        <IsAuthenticated>
          {/* Team */}
          {/* <Route exact path="/create/team" component={CreateTeam} /> */}
          <Route path="/team" component={TeamDashboard} />
          <Route exact path="/teams/chat" component={TeamChatLandingPage} />
          <ErrorBoundary>
            <Route exact path="/teams/chat/:teamID" component={TeamChat} />
          </ErrorBoundary>

          <Route
            exact
            path="/team/:teamId/archived"
            component={ArchivedTeamProjects}
          />
          {/* <Route exact path="/join/team" component={JoinTeam} /> */}

          {/* Project */}
          <ErrorBoundary>
            <Route path="/project" component={ProjectDashboard} />
          </ErrorBoundary>
        </IsAuthenticated>
      </Switch>
      {/* {this.props.showModal && <DeleteModal />} */}
    </div>
  );
};

const mapDispatchToProps = {
  setErrors,
  logoutUser,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  authenticated: state.user.authenticated,
  showModal: state.modal.showModal,
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
