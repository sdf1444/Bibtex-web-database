import { push } from 'connected-react-router';
import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from './types';
import setAuthToken from '../utils/setAuthToken';

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data.response
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = ({ name, email, role, username, password }) => async (
  dispatch
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ name, email, role, username, password });

  try {
    const res = await axios.post('/api/user/register-user', body, config);
    console.log('HERE');
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Login User
export const login = (username, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/auth', { username, password }, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data.response
    });

    dispatch(loadUser());
  } catch (err) {
    const error = err.response.data.error;

    if (error) {
      dispatch(setAlert(error.reason, 'danger'));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Logout / Clear editor
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
