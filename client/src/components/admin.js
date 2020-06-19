import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import axios from 'axios';
import TableUser from '../components/layout/';
import ModalUser from '../components/layout/ModalUser';

class App extends Component {
  constructor() {
    super();

    this.server = '/';

    this.state = {
      users: [],
    };

    this.fetchUsers = this.fetchUsers.bind(this);
    this.handleUserAdded = this.handleUserAdded.bind(this);
    this.handleUserUpdated = this.handleUserUpdated.bind(this);
    this.handleUserDeleted = this.handleUserDeleted.bind(this);
  }

  // Fetch data from back-end
  fetchUsers() {
    axios
      .get('/users/api/users')
      .then((response) => {
        this.setState({ users: response.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleUserAdded(user) {
    let users = this.state.users.slice();
    users.push(user);
    this.setState({ users: users });
  }

  handleUserUpdated(user) {
    let users = this.state.users.slice();
    for (let i = 0, n = users.length; i < n; i++) {
      if (users[i]._id == user._id) {
        users[i].name = user.name;
        users[i].email = user.email;
        users[i].role = user.role;
        users[i].username = user.email;
        users[i].password = user.password;
        break;
      }
    }
    this.setState({ users: users });
  }

  handleUserDeleted(user) {
    let users = this.state.users.slice();
    users = users.filter((u) => {
      return u._id !== user._id;
    });
    this.setState({ users: users });
  }

  render() {
    return (
      <div>
        <Container>
          <ModalUser
            headerTitle='Add User'
            buttonTriggerTitle='Add New'
            buttonSubmitTitle='Add'
            buttonColor='green'
            onUserAdded={this.handleUserAdded}
            server={this.server}
          />
          <TableUser
            onUserUpdated={this.handleUserUpdated}
            onUserDeleted={this.handleUserDeleted}
            users={this.state.users}
            server={this.server}
          />
        </Container>
      </div>
    );
  }
}

export default Admin;
