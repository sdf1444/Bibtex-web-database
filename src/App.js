import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './components/layout/Homepage';
import Login from './components/auth/Login';
import RecoverPassword from './components/passwordReset/RecoverPassword';
import UpdatePassword from './components/passwordReset/UpdatePassword';
import Welcome from './components/welcome/Welcome';
import Admin from './components/admin/Admin';
import CreateUser from './components/admin/CreateUser';
import EditUser from './components/admin/EditUser';
import Editor from './components/editor/Editor';
import Paper from './components/paper/Paper';
import PublicDatabases from './components/publicDatabases/publicDatabases';
import Alert from './components/layout/Alert';
import PrivateRoute from './components/routing/PrivateRoute';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';
import Group from './components/group/Group';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Home} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route
                exact
                path='/recoverPassword'
                component={RecoverPassword}
              />
              <Route exact path='/reset/:id' component={UpdatePassword} />
              <PrivateRoute exact path='/welcome' component={Welcome} />
              <PrivateRoute exact path='/admin' component={Admin} />
              <PrivateRoute exact path='/create-users' component={CreateUser} />
              <PrivateRoute exact path='/edit-user/:id' component={EditUser} />
              <PrivateRoute exact path='/editor' component={Editor} />
              <PrivateRoute exact path='/papers' component={Paper} />
              <PrivateRoute
                exact
                path='/publicDatabases'
                component={PublicDatabases}
              />
              <PrivateRoute exact path='/groups' component={Group} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
