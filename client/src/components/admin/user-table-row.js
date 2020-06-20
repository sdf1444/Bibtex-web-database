import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

class UserTableRow extends Component {
  render() {
    return (
      <tr>
        <td>{this.props.obj.name}</td>
        <td>{this.props.obj.email}</td>
        <td>{this.props.obj.role}</td>
        <td>{this.props.obj.username}</td>
        <td>{this.props.obj.password}</td>
        <td>
          <Link className='edit-link' to={'/edit-users/' + this.props.obj._id}>
            Edit
          </Link>
          <Button size='sm' variant='danger'>
            Delete
          </Button>
        </td>
      </tr>
    );
  }
}

export default UserTableRow;
