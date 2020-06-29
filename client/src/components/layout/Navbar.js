import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, loading, role }, logout }) => {
  console.log(role);
  const authLinks = (
    <ul>
      {(() => {
        if (role == 'admin') {
          return (
            <li>
              <Link to='/admin'>Admin</Link>
            </li>
          );
        }
      })()}
      <li>
        <Link to='/editor'>Editor</Link>
      </li>
      <li>
        <Link to='/papers'>Papers</Link>
      </li>
      <li>
        <a onClick={logout} href='#!'>
          <i className='fas fa-sign-out-alt'></i>{' '}
          <span className='hide-sm'></span>Logout
        </a>
      </li>
    </ul>
  );

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code' /> Bibtex
        </Link>
      </h1>
      {!loading && <Fragment>{isAuthenticated ? authLinks : null}</Fragment>}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
