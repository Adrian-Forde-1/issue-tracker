import React, { useEffect } from 'react';
import './App.css';

//Tostify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Components
import Homepage from './components/Homepage';
import Login from './components/Login';
import Signup from './components/Signup';
import Manager from './components/Manager';
import CreateProject from './components/CreateProject';
import CreateGroup from './components/CreateGroup';
import IndividualGroup from './components/IndividualGroup';
import IndividualProject from './components/IndividualProject';
import NewBug from './components/NewBug';
import Labels from './components/Labels';
import AddLabel from './components/AddLabel';
import EditLabel from './components/EditLabel';
import IndividualBug from './components/IndividualBug';
import NewNote from './components/NewNote';
import CreateGroupProject from './components/CreateGroupProject';
import JoinGroup from './components/JoinGroup';
import IsAuthenticated from './components/IsAuthenticated';
import IsNotAuthenticated from './components/IsNotAuthenticated.jsx';

//React Router Dom
import { Route, withRouter, Switch } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

function App(props) {
  const { user } = props;

  // useEffect(() => {
  //   if (
  //     props.location.pathname === '/' ||
  //     props.location.pathname === '/login' ||
  //     (props.location.pathname === '/signup' && user !== null)
  //   ) {
  //     props.history.replace('/manager');
  //   }
  // }, [props.location.pathname]);

  toast.configure({
    position: toast.POSITION.TOP_CENTER,
    autoClose: 4000,
  });
  return (
    <div className="App">
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signUp" component={Signup} />

        <IsAuthenticated>
          <Route exact path="/manager" component={Manager} />
          <Route exact path="/project/:projectId/bug/new" component={NewBug} />
          <Route exact path="/bug/:bugId" component={IndividualBug} />
          <Route exact path="/bug/:bugId/note/new" component={NewNote} />

          <Route exact path="/create/project" component={CreateProject} />
          <Route
            exact
            path="/project/:projectId/label/create"
            component={AddLabel}
          />
          <Route
            exact
            path="/project/:projectId/label/:labelId/edit"
            component={EditLabel}
          />
          <Route exact path="/project/:projectId/labels" component={Labels} />
          <Route
            exact
            path="/project/:projectId"
            component={IndividualProject}
          />

          <Route exact path="/join/group" component={JoinGroup} />
          <Route exact path="/create/group" component={CreateGroup} />
          <Route
            exact
            path="/group/:groupId/project/create"
            component={CreateGroupProject}
          />
          <Route exact path="/group/:groupId" component={IndividualGroup} />
        </IsAuthenticated>
      </Switch>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(withRouter(App));
