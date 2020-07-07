import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, GhostInput } from '../passwordReset/styles/styledComponents';
import PropTypes from 'prop-types';

import { RecoverPasswordStyles as UpdatePasswordStyles } from './RecoverPassword';

class UpdatePassword extends Component {
  state = {
    password: '',
    confirmPassword: '',
    submitted: false,
  };

  handleChange = (key) => (e) => {
    this.setState({ [key]: e.target.value });
  };

  updatePassword = (e) => {
    e.preventDefault();
    const { password } = this.state;

    axios
      .put(
        'http://localhost:5000/api/user/updatePassword/' +
          this.props.match.params.id,
        { password }
      )
      .then((res) => res)
      .catch((err) =>
        console.warn('ERROR FROM SERVER UPDATING PASSWORD:', err)
      );
    this.setState({ submitted: !this.state.submitted });
  };

  render() {
    const { submitted } = this.state;

    return (
      <UpdatePasswordStyles>
        <h3 style={{ paddingBottom: '1.25rem' }}>Update your password</h3>
        {submitted ? (
          <div className='reset-password-form-sent-wrapper'>
            <p>Your password has been saved.</p>
            <Link to='/login' className='ghost-btn'>
              Sign back in
            </Link>
          </div>
        ) : (
          <div className='reset-password-form-wrapper'>
            <form
              onSubmit={this.updatePassword}
              style={{ paddingBottom: '1.5rem' }}
            >
              <GhostInput
                onChange={this.handleChange('password')}
                value={this.state.password}
                placeholder='New password'
                type='password'
              />
              <GhostInput
                onChange={this.handleChange('confirmPassword')}
                value={this.state.confirmPassword}
                placeholder='Confirm password'
                type='password'
              />

              <Button className='btn-primary password-reset-btn'>
                Update password
              </Button>
            </form>

            <p
              style={{
                fontSize: '1rem',
                maxWidth: '420px',
                paddingLeft: '0.5rem',
              }}
            >
              Make sure it's at least 8 characters including a number and a
              lowercase letter. Read some documentation on{' '}
              <a
                href='https://help.github.com/articles/creating-a-strong-password/'
                target='_blank'
                rel='noopener noreferrer'
              >
                safer password practices
              </a>
              .
            </p>
          </div>
        )}
      </UpdatePasswordStyles>
    );
  }
}

UpdatePassword.propTypes = {
  token: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default UpdatePassword;
