import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

class EditPaper extends Component {
  constructor(props) {
    super(props);

    this.onChangePaperPaper = this.onChangePaperPaper.bind(this);
    this.onChangePaperDoi = this.onChangePaperDoi.bind(this);
    this.onChangePaperPdf = this.onChangePaperPdf.bind(this);

    this.onSubmit = this.onSubmit.bind(this);

    // State
    this.state = {
      paper: '',
      doi: '',
      pdf: '',
    };
  }

  componentDidMount() {
    axios
      .get('http://localhost:5000/api/papers/' + this.props.match.params.id)
      .then((res) => {
        this.setState({
          paper: res.data.paper,
          doi: res.data.doi,
          pdf: res.data.pdf,
        });
      })
      .catch((error) => {
        console.log(error);
      });
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
      .put(
        'http://localhost:5000/api/papers/' + this.props.match.params.id,
        paperObject
      )
      .then((res) => {
        console.log(res.data);
        console.log('Paper successfully updated');
      })
      .catch((error) => {
        console.log(error);
      });
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

          <Form.Group controlId='Pdf'>
            <Form.Label>Pdf</Form.Label>
            <Form.Control
              type='text'
              value={this.state.pdf}
              onChange={this.onChangePaperPdf}
            />
          </Form.Group>

          <div className='btn btn-dark'>Update Paper</div>
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

export default EditPaper;
