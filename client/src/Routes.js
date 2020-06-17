import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './containers/Home';
import Login from './containers/Login';
import ForgotPassword from './containers/ForgotPassword';
import ResetPassword from './containers/ResetPassword';

const Routes = () => (
  <div>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/reset/:token' component={ResetPassword} />
      <Route exact path='/forgotPassword' component={ForgotPassword} />
    </Switch>
  </div>
);

export default Routes;
