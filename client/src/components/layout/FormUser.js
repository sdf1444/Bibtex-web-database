import React, { Component } from 'react';
import { Message, Button, Form, Select } from 'semantic-ui-react';
import axios from 'axios';

class FormUser extends Component {
  constructor(props) {
    super(props);

    this.set = {
      name: '',
      email: '',
      role: '',
      username: '',
      password: '',
      formClassName: '',
      formSuccessMessage: '',
      formErrorMessage: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    //Fill in the form with the appropriate data if user id is provided
    if (this.props.userID) {
      axios
        .get(`${this.props.server}/api/users/${this.props.userID}`)
        .then((response) => {
          this.setState({
            name: response.data.name,
            email: response.data.email,
            role: response.data.role,
            username: response.data.username,
            password: data.response.password,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  handleInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const user = {
      name: this.state.name,
      email: this.state.email,
      role: this.state.role,
      username: this.state.username,
      password: this.state.password,
    };
  }
}
