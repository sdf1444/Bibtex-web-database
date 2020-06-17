import axios from 'axios';
import { setAlert } from './alert';
import { REGISTER_SUCESS, REGISTER_FAIL } from './types';

// Register User
export const register = ({ name, email, username, password }) => async (
  dispatch
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, username, password });

  try {
    const res = await axios.post('/api/users/register-user', body, config);

    dispatch({
      type: REGISTER_SUCESS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};
