import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import UserTableRow from './user-table-row';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    axios
      .get('http://localhost:5000/api/users')
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
      <div>
        <div className='buttons'>
          <Link to='/create-users' className='btn btn-light'>
            Create User
          </Link>
        </div>
        <div className='table-wrapper'>
          <Table striped bordered hover>
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
          </Table>
        </div>
      </div>
    );
  }
}

export default Admin;
