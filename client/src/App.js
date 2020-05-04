import React, { useEffect } from 'react';
import './App.css';

//Tostify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import Breadcrumbs from './components/Breadcrumbs';
// import IsNotAuthenticated from './components/IsNotAuthenticated.jsx';

//React Router Dom
import { Route, withRouter, Switch } from 'react-router-dom';

//Components
import Homepage from './components/Homepage';
import Login from './components/Login';
import Signup from './components/Signup';
import Manager from './components/Manager';
import IsAuthenticated from './components/IsAuthenticated';
import Navbar from './components/Navbar';
import { connect } from 'react-redux';
import AllTeams from './components/Teams/AllTeams';
import IndividualTeam from './components/Teams/IndividualTeam';
import CreateTeam from './components/Teams/CreateTeam';
import IndividualProject from './components/Projects/IndividualProject';
import CreateProject from './components/Projects/CreateProject';
import Labels from './components/Labels/Labels';
import EditLabel from './components/Labels/EditLabel';
import AddLabel from './components/Labels/AddLabel';
import IndividualBug from './components/Bugs/IndividualBug';
import NewBug from './components/Bugs/NewBug';
import EditBug from './components/Bugs/EditBug';
import AllProjects from './components/Projects/AllProjects';
import ArchivedProjects from './components/Projects/ArchivedProjects';
import ArchivedTeamProjects from './components/Projects/ArchivedTeamProjects';
import CreateTeamProject from './components/Teams/CreateTeamProject';
import JoinTeam from './components/Teams/JoinTeam';

function App() {
  toast.configure({
    position: toast.POSITION.TOP_CENTER,
    autoClose: 4000,
  });
  return (
    <div className="App">
      <ToastContainer />
      <Navbar />
      {/* <Breadcrumbs /> */}
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signUp" component={Signup} />

        {/* <IsAuthenticated> */}
        <Route exact path="/manager" component={Manager} />

        {/* Team */}
        <Route exact path="/teams" component={AllTeams} />
        <Route exact path="/team/:teamId" component={IndividualTeam} />
        <Route exact path="/create/team" component={CreateTeam} />
        <Route
          exact
          path="/team/:teamId/archived"
          component={ArchivedTeamProjects}
        />
        <Route
          exact
          path="/team/:teamId/project/create"
          component={CreateTeamProject}
        />
        <Route exact path="/join/team" component={JoinTeam} />

        {/* Project */}
        <Route exact path="/projects" component={AllProjects} />
        <Route exact path="/project/:projectId" component={IndividualProject} />
        <Route exact path="/create/project" component={CreateProject} />
        <Route exact path="/projects/archived" component={ArchivedProjects} />

        {/* Labels */}
        <Route exact path="/project/:projectId/labels" component={Labels} />
        <Route
          exact
          path="/project/:projectId/label/:labelId/edit"
          component={EditLabel}
        />
        <Route
          exact
          path="/project/:projectId/label/add"
          component={AddLabel}
        />

        {/* Bug */}
        <Route
          exact
          path="/project/:projectId/bug/:bugId"
          component={IndividualBug}
        />
        <Route exact path="/project/:projectId/new/bug" component={NewBug} />
        <Route
          exact
          path="/project/:projectId/bug/:bugId/edit"
          component={EditBug}
        />

        {/* </IsAuthenticated> */}
      </Switch>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(withRouter(App));
