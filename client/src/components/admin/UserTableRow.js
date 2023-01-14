import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './UserTableRow.css';

const UserTableRow = (props) => {
  return (
    <tr>
      <td>{props.user.name}</td>
      <td>{props.user.email}</td>
      <td>{props.user.role}</td>
      <td>{props.user.username}</td>
      <td className='actions'>
        <Link to={'/edit-user/' + props.user._id} className='button-big'>
          Edit
        </Link>
        <Button
          onClick={() =>
            props.dispatch({
              type: 'delete',
              user: props.user,
            })
          }
          variant='danger'
          className='delete-btn'
        >
          Delete
        </Button>
      </td>
    </tr>
  );
};

export default UserTableRow;
