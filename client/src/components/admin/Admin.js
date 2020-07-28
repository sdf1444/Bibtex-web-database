import React from 'react';
import { useReducer, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import UserTableRow from './UserTableRow';
import { Link } from 'react-router-dom';
import { Dropdown, Menu } from 'semantic-ui-react';
import { getUser } from '../../actions/editor';
import './Admin.css';

function adminReducer(state, action) {
  switch (action.type) {
    case 'setCurrentUser': {
      return {
        ...state,
        currentUser: action.user
      };
    }
    case 'delete': {
      return {
        ...state,
        isDeleting: true,
        deletedUser: action.user
      };
    }
    case 'search': {
      return {
        ...state,
        search: action.value
      };
    }
    case 'searchParam': {
      return {
        ...state,
        searchParam: action.value
      };
    }
    case 'finishLoading': {
      return {
        ...state,
        isLoading: false,
        users: action.users
      };
    }
    case 'finishDeleting': {
      if (!action.ok) {
        return { ...state, isDeleting: false, deletedUser: null };
      }
      return {
        ...state,
        isDeleting: false,
        isLoading: true,
        deletedUser: null
      };
    }
    default:
      return state;
  }
}

const searchParams = [
  { key: 1, text: 'Name', value: 'name' },
  { key: 2, text: 'Email', value: 'email' },
  { key: 3, text: 'Username', value: 'username' }
];

const Admin = (props) => {
  const initialState = {
    isLoading: true,
    currentUser: null,
    isDeleting: false,
    deletedUser: null,
    users: null,
    search: '',
    searchParam: 'name'
  };

  const [state, dispatch] = useReducer(adminReducer, initialState);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getUser();
      dispatch({ type: 'setCurrentUser', user });
    };
    if (!state.currentUser) fetchCurrentUser();
  }, [state.currentUser]);

  useEffect(() => {
    const fetchUsers = () =>
      axios.get('/api/user').then((res) => {
        console.log(res.data);
        dispatch({
          type: 'finishLoading',
          users: res.data,
          ok: true
        });
      });
    if (state.isLoading) fetchUsers();
  }, [state.isLoading]);
  useEffect(() => {
    const deleteUser = async () => {
      const res = await axios.delete(`/api/user/${state.deletedUser._id}`);
      dispatch({
        type: 'finishDeleting',
        user: res.data,
        ok: true
      });
    };
    if (state.isDeleting) deleteUser();
  }, [state.isDeleting, state.deletedUser]);

  if (state.isLoading) return <div>Loading...</div>;

  if (state.currentUser.role !== 'admin') {
    return (
      <div>
        <div className="warning">You don't have access to this page</div>
      </div>
    );
  }

  const usersFilter = (user) => {
    if (state.search === '') return true;
    return user[state.searchParam].includes(state.search);
  };

  const dataTable = state.users.filter(usersFilter).map((user) => {
    return <UserTableRow user={user} dispatch={dispatch} key={user._id} />;
  });
  console.log(state.searchParam);
  console.log(state.search);
  return (
    <div className="admin">
      <div className="buttons">
        <Link to="/create-users" className="create-btn button-big">
          Create User
        </Link>
        <div className="select-param">
          <Menu compact className="select-param">
            <Dropdown
              value={state.searchParam}
              options={searchParams}
              simple
              item
              onChange={(e, data) =>
                dispatch({
                  type: 'searchParam',
                  value: data.value
                })
              }
            ></Dropdown>
          </Menu>
        </div>
        <input
          className="search"
          placeholder="Enter a value"
          value={state.search}
          onChange={(e) =>
            dispatch({
              type: 'search',
              value: e.target.value
            })
          }
        ></input>
      </div>
      <div className="table-wrapper">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{dataTable}</tbody>
        </Table>
      </div>
    </div>
  );
};

export default Admin;
