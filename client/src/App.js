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
import AllGroups from './components/Groups/AllGroups';
import IndividualGroup from './components/Groups/IndividualGroup';
import CreateGroup from './components/Groups/CreateGroup';
import CreateGroupProject from './components/Groups/CreateGroupProject';
import IndividualProject from './components/Projects/IndividualProject';
import CreateProject from './components/Projects/CreateProject';
import Labels from './components/Labels/Labels';
import EditLabel from './components/Labels/EditLabel';
import AddLabel from './components/Labels/AddLabel';
import IndividualBug from './components/Bugs/IndividualBug';
import NewBug from './components/Bugs/NewBug';
import EditBug from './components/Bugs/EditBug';
import AllProjects from './components/Projects/AllProjects';
import JoinGroup from './components/Groups/JoinGroup';
import ArchivedProjects from './components/Projects/ArchivedProjects';
import ArchivedGroupProjects from './components/Projects/ArchivedGroupProjects';

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

        {/* Group */}
        <Route exact path="/groups" component={AllGroups} />
        <Route exact path="/group/:groupId" component={IndividualGroup} />
        <Route exact path="/group/create" component={CreateGroup} />
        <Route exact path="/group/archived" component={ArchivedGroupProjects} />
        <Route
          exact
          path="/group/:groupId/project/create"
          component={CreateGroupProject}
        />
        <Route exact path="/group/join" component={JoinGroup} />

        {/* Project */}
        <Route exact path="/projects" component={AllProjects} />
        <Route exact path="/project/:projectId" component={IndividualProject} />
        <Route exact path="/project/create" component={CreateProject} />
        <Route exact path="/project/archived" component={ArchivedProjects} />

        {/* Labels */}
        <Route exact path="/project/:projectId/labels" component={Labels} />
        <Route
          exact
          path="/project/:projectId/label/:labelId/edit"
          component={EditLabel}
        />
        <Route exact path="/create/label" component={AddLabel} />

        {/* Bug */}
        <Route
          exact
          path="/project/:projectId/bug/:bugId"
          component={IndividualBug}
        />
        <Route exact path="/create/bug" component={NewBug} />
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
