import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div>
      <nav className='navbar bg-dark'>
        <h1>
          <Link to='/'>
            <i className='fas fa-code' /> Bibtex
          </Link>
        </h1>
      </nav>
    </div>
  );
};

export default Navbar;
