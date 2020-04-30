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
import IsAuthenticated from './components/IsAuthenticated';
import Navbar from './components/Navbar';
// import Breadcrumbs from './components/Breadcrumbs';
// import IsNotAuthenticated from './components/IsNotAuthenticated.jsx';

//React Router Dom
import { Route, withRouter, Switch } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

function App(props) {
  // sessionStorage.setItem('breadcrumbs', JSON.stringify([]));

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

        {/* </IsAuthenticated> */}
      </Switch>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(withRouter(App));
