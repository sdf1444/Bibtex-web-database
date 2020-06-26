import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

class PaperTableRow extends Component {
  constructor(props) {
    super(props);
    this.deletePaper = this.deletePaper.bind(this);
  }
  deletePaper() {
    axios
      .delete('http://localhost:5000/api/papers/' + this.props.obj._id)
      .then((res) => {
        console.log('Paper successfully deleted!');
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <tr>
        <td>{this.props.obj.paper}</td>
        <td>{this.props.obj.doi}</td>
        <td>
          <a href={this.props.obj.pdf} download>
            {this.props.obj.pdf}
          </a>
        </td>
        <td>
          <Button size='sm' variant='danger'>
            Export reference
          </Button>
          <Link to={'/edit-papers/' + this.props.obj._id}>Edit</Link>
          <Button onClick={this.deletePaper} size='sm' variant='danger'>
            Delete
          </Button>
        </td>
      </tr>
    );
  }
}

export default PaperTableRow;
