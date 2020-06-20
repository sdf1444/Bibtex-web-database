import React from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
  return (
    <div className='buttons'>
      <Link to='/create-users' className='btn btn-light'>
        Create User
      </Link>
      <Link to='/user-list' className='btn btn-light'>
        User List
      </Link>
    </div>
  );
};

export default Admin;
