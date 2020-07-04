import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import UserTableRow from './UserTableRow';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    axios
      .get('http://localhost:5000/api/user')
      .then((res) => {
        this.setState({
          users: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  DataTable() {
    return this.state.users.map((res, i) => {
      return <UserTableRow obj={res} key={i} />;
    });
  }

  render() {
    return (
      <div className='admin'>
        <div className='button'>
          <Link to='/create-users' className='btn btn-light'>
            Create User
          </Link>
        </div>
        <div className='table-wrapper'>
          <h1 className='users'>Users List</h1>
          <table className='usersTable'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Username</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>{this.DataTable()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Admin;
