import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';

const Welcome = ({ auth: { user }, auth: { auth, loading } }) => {
  useEffect(() => {}, []);

  return loading && auth === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Bibtex</h1>
      <p className='lead'>
        <i />
        Hello! {user && user.name} Welcome to the Bixtex editor!
      </p>
      <p>
        <small>Logged in as: {user && user.role}</small>
      </p>
    </Fragment>
  );
};

Welcome.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.user,
});

export default connect(mapStateToProps)(Welcome);
