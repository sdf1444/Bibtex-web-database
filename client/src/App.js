import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './components/layout/Homepage';
import Login from './components/auth/Login';
import Admin from './components/admin/Admin';
import CreateUser from './components/admin/CreateUsers';
import Alert from './components/layout/Alert';
import Editor from './components/editor/Editor';
import Paper from './components/paper/Paper';
import PrivateRoute from './components/routing/PrivateRoute';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';

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
              <PrivateRoute exact path='/admin' component={Admin} />
              <PrivateRoute exact path='/create-users' component={CreateUser} />
              <PrivateRoute exact path='/editor' component={Editor} />
              <PrivateRoute exact path='/papers' component={Paper} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
