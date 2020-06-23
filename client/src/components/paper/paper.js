import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import PaperTableRow from './paper-table-row';

class Paper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      papers: [],
    };
  }

  componentDidMount() {
    axios
      .get('http://localhost:5000/api/papers')
      .then((res) => {
        this.setState({
          papers: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  DataTable() {
    return this.state.papers.map((res, i) => {
      return <PaperTableRow obj={res} key={i} />;
    });
  }

  render() {
    return (
      <div>
        <div className='buttons'>
          <Link to='/create-papers' className='btn btn-light'>
            Create Paper
          </Link>
        </div>
        <div className='table-wrapper'>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Paper</th>
                <th>DOI</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>{this.DataTable()}</tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default Paper;
