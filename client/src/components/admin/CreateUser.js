import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    username: '',
    password: '',
    password2: '',
  });

  const { name, email, role, username, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      if (register({ name, email, role, username, password })) {
        alert('User created');
      }
    }
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Create User</h1>
      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            required
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            unique
            required
            value={email}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Role'
            name='role'
            required
            value={role}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Username'
            name='username'
            required
            value={username}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            required
            minLength='6'
            value={password}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            required
            value={password2}
            onChange={onChange}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
        <div className='buttons'>
          <Link to='/admin' className='btn btn-dark'>
            Back
          </Link>
        </div>
      </form>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
