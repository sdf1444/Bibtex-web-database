import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';

class EditUser extends Component {
  constructor(props) {
    super(props);

    this.onChangeUserName = this.onChangeUserName.bind(this);
    this.onChangeUserEmail = this.onChangeUserEmail.bind(this);
    this.onChangeUserRole = this.onChangeUserRole.bind(this);
    this.onChangeUserUsername = this.onChangeUserUsername.bind(this);
    this.onChangeUserPassword = this.onChangeUserPassword.bind(this);

    this.onSubmit = this.onSubmit.bind(this);

    // State
    this.state = {
      name: '',
      email: '',
      role: '',
      username: '',
      password: '',
    };
  }

  componentDidMount() {
    axios
      .get('http://localhost:5000/api/user/' + this.props.match.params.id)
      .then((res) => {
        this.setState({
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          username: res.data.username,
          password: res.data.password,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onChangeUserName(e) {
    this.setState({ name: e.target.value });
  }

  onChangeUserEmail(e) {
    this.setState({ email: e.target.value });
  }

  onChangeUserRole(e) {
    this.setState({ role: e.target.value });
  }

  onChangeUserUsername(e) {
    this.setState({ username: e.target.value });
  }

  onChangeUserPassword(e) {
    this.setState({ password: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const userObject = {
      name: this.state.name,
      email: this.state.email,
      role: this.state.role,
      username: this.state.username,
      password: this.state.password,
    };

    axios
      .put(
        'http://localhost:5000/api/user/' + this.props.match.params.id,
        userObject
      )
      .then((res) => {
        console.log(res.data);
        console.log('User successfully updated');
        alert('User updated');
      })
      .catch((error) => {
        console.log(error);
      });

    // Redirect to User List
  }

  render() {
    return (
      <div className='form-wrapper'>
        <Form onSubmit={this.onSubmit}>
          <Form.Group controlId='Name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              required
              value={this.state.name}
              onChange={this.onChangeUserName}
            />
          </Form.Group>

          <Form.Group controlId='Email'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='email'
              required
              value={this.state.email}
              onChange={this.onChangeUserEmail}
            />
          </Form.Group>

          <Form.Group controlId='Role'>
            <Form.Label>Role</Form.Label>
            <Form.Control
              type='text'
              required
              value={this.state.role}
              onChange={this.onChangeUserRole}
            />
          </Form.Group>

          <Form.Group controlId='Username'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type='text'
              required
              value={this.state.username}
              onChange={this.onChangeUserUsername}
            />
          </Form.Group>

          <Form.Group controlId='Password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              minlength='6'
              required
              value={this.state.password}
              onChange={this.onChangeUserPassword}
            />
          </Form.Group>

          <Button variant='danger' size='sm' type='submit'>
            Update User
          </Button>
          <Link to='/admin' className='btn btn-dark'>
            Back
          </Link>
        </Form>
      </div>
    );
  }
}

export default EditUser;
