import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

class UserTableRow extends Component {
  constructor(props) {
    super(props);
    this.deleteUser = this.deleteUser.bind(this);
  }

  deleteUser() {
    axios
      .delete('http://localhost:5000/api/user/' + this.props.obj._id)
      .then((res) => {
        console.log('User successfully deleted!');
        alert('User deleted');
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <tr>
        <td>{this.props.obj.name}</td>
        <td>{this.props.obj.email}</td>
        <td>{this.props.obj.role}</td>
        <td>{this.props.obj.username}</td>
        <td>{this.props.obj.password}</td>
        <td>
          <Link to={'/edit-user/' + this.props.obj._id}>Edit</Link>
          <Button onClick={this.deleteUser} size='sm' variant='danger'>
            Delete
          </Button>
        </td>
      </tr>
    );
  }
}

export default UserTableRow;
