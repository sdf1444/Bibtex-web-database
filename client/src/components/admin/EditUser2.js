import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './EditUser.css';

class EditUser extends Component {
  constructor(props) {
    super(props);

    this.onChangeUserName = this.onChangeUserName.bind(this);
    this.onChangeUserEmail = this.onChangeUserEmail.bind(this);
    this.onChangeUserRole = this.onChangeUserRole.bind(this);
    this.onChangeUserUsername = this.onChangeUserUsername.bind(this);

    this.onSubmit = this.onSubmit.bind(this);

    // State
    this.state = {
      name: '',
      email: '',
      role: '',
      username: '',
    };
  }

  componentDidMount() {
    axios
      .get('/api/user/' + this.props.match.params.id)
      .then((res) => {
        this.setState({
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          username: res.data.username,
          password: '',
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

  onChangePassword = (e) => {
    this.setState({ password: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    console.log('submitting')

    const userObject = {
      name: this.state.name,
      email: this.state.email,
      role: this.state.role,
      username: this.state.username,
    };

    axios
      .put(
        '/api/user/' + this.props.match.params.id,
        userObject
      )
      .then((res) => {
        console.log(res.data);
        console.log('User successfully updated');
      })
      .catch((error) => {
        console.log(error);
      });
    
    if (this.state.password !== '') {
      axios.put('/api/user/updatePassword/' + this.props.match.params.id,
      this.state.password).then(res => console.log(res.data))
    }

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
              value={this.state.name}
              onChange={this.onChangeUserName}
            />
          </Form.Group>

          <Form.Group controlId='Email'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='email'
              value={this.state.email}
              onChange={this.onChangeUserEmail}
            />
          </Form.Group>

          <Form.Group controlId='Role'>
            <Form.Label>Role</Form.Label>
            <Form.Control
              type='text'
              value={this.state.role}
              onChange={this.onChangeUserRole}
            />
          </Form.Group>

          <Form.Group controlId='Username'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type='text'
              value={this.state.username}
              onChange={this.onChangeUserUsername}
            />
          </Form.Group>

          <Form.Group controlId='Password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='text'
              value={this.state.password}
              onChange={this.onChangePassword}
            />
          </Form.Group>

          <Button variant='danger' size='lg' block='block' type='submit'>
            Update User
          </Button>
        </Form>
        <Link to='/admin' className="link-back">Back to admin page</Link>
      </div>
    );
  }
}

export default EditUser;
