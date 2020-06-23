import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

class CreatePaper extends Component {
  constructor(props) {
    super(props);

    // Setting up functions
    this.onChangePaperPaper = this.onChangePaperPaper.bind(this);
    this.onChangePaperDoi = this.onChangePaperDoi.bind(this);
    this.onChangePaperPdf = this.onChangePaperPdf.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    // Setting up state
    this.state = {
      paper: '',
      doi: '',
      pdf: '',
    };
  }

  onChangePaperPaper(e) {
    this.setState({ paper: e.target.value });
  }

  onChangePaperDoi(e) {
    this.setState({ doi: e.target.value });
  }

  onChangePaperPdf(e) {
    this.setState({ pdf: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const paperObject = {
      paper: this.state.paper,
      doi: this.state.doi,
      pdf: this.state.pdf,
    };
    axios
      .post('http://localhost:5000/api/papers', paperObject)
      .then((res) => console.log(res.data));

    this.setState({ paper: '', doi: '', pdf: '' });
  }

  render() {
    return (
      <div className='form-wrapper'>
        <Form onSubmit={this.onSubmit}>
          <Form.Group controlId='Paper'>
            <Form.Label>Paper</Form.Label>
            <Form.Control
              type='text'
              value={this.state.paper}
              onChange={this.onChangePaperPaper}
            />
          </Form.Group>

          <Form.Group controlId='Doi'>
            <Form.Label>Doi</Form.Label>
            <Form.Control
              type='text'
              value={this.state.doi}
              onChange={this.onChangePaperDoi}
            />
          </Form.Group>

          <Form.Group controlId='Doi'>
            <Form.Label>Pdf</Form.Label>
            <Form.Control
              type='text'
              value={this.state.pdf}
              onChange={this.onChangePaperPdf}
            />
          </Form.Group>

          <div className='btn btn-dark'>Create Paper</div>
          <div className='buttons'>
            <Link to='/papers' className='btn btn-light'>
              Back
            </Link>
          </div>
        </Form>
      </div>
    );
  }
}

export default CreatePaper;
