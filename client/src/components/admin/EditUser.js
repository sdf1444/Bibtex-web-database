import React, { useReducer, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { updateUser } from '../../actions/useredit';
import { Link } from 'react-router-dom';
import './EditUser.css';

function editUserDispater(state, action) {
  switch (action.type) {
    case 'clearMessages': {
      console.log('CLEARING');
      return {
        ...state,
        messages: [],
        clearing: false,
      };
    }
    case 'save': {
      return {
        ...state,
        isSaving: true,
      };
    }
    case 'finishSaving': {
      let isLoading = false;
      if (
        (action.fields && action.fields.ok) ||
        (action.password && action.password.ok)
      ) {
        isLoading = true;
      }
      if (action.fields) state.messages.push(action.fields);
      if (action.password) state.messages.push(action.password);
      return {
        ...state,
        isSaving: false,
        clearing: true,
        isLoading,
      };
    }
    case 'changePassword': {
      console.log('here');
      if (!action.ok) {
        return state;
      }
      return {
        ...state,
        isLoading: true,
        password: '',
      };
    }
    case 'finishLoading': {
      return {
        ...state,
        isLoading: false,
        name: action.name,
        email: action.email,
        role: action.role,
        username: action.username,
      };
    }
    case 'name':
      return { ...state, name: action.value };
    case 'email':
      return { ...state, email: action.value };
    case 'role':
      return { ...state, role: action.value };
    case 'username':
      return { ...state, username: action.value };
    case 'password':
      return { ...state, password: action.value };
    default:
      return state;
  }
}

const EditUser = (props) => {
  const initialState = {
    messages: [],
    clearing: false,
    isLoading: true,
    isSaving: false,
    name: '',
    email: '',
    role: '',
    username: '',
    password: '',
  };
  const [state, dispatch] = useReducer(editUserDispater, initialState);

  useEffect(() => {
    if (state.clearing)
      setTimeout(() => dispatch({ type: 'clearMessages' }), 5000);
  }, [state.clearing]);
  useEffect(() => {
    axios.get('/api/user/' + props.match.params.id).then((res) => {
      dispatch({
        type: 'finishLoading',
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        username: res.data.username,
      });
    });
  }, [props.match.params.id]);
  useEffect(() => {
    const saveUser = async () => {
      console.log('submiting');
      const userObject = {
        name: state.name,
        email: state.email,
        role: state.role,
        username: state.username,
      };
      const res = await updateUser(
        userObject,
        state.password,
        props.match.params.id
      );
      dispatch({
        type: 'finishSaving',
        ...res,
      });
    };
    if (state.isSaving) saveUser();
  }, [
    state.isSaving,
    state.name,
    state.email,
    state.role,
    state.username,
    state.password,
    props.match.params.id,
  ]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'save' });
  };

  return (
    <div className='form-wrapper'>
      <Form onSubmit={onFormSubmit} autoComplete='off'>
        <Form.Group controlId='Name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            required
            type='text'
            value={state.name}
            onChange={(e) => dispatch({ type: 'name', value: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId='Email'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            unique
            required
            type='email'
            value={state.email}
            onChange={(e) => dispatch({ type: 'email', value: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId='Role'>
          <Form.Label>Role</Form.Label>
          <Form.Control
            required
            as='select'
            value={state.role}
            onChange={(e) => dispatch({ type: 'role', value: e.target.value })}
          >
            <option>user</option>
            <option>admin</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId='Username'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            required
            type='text'
            value={state.username}
            onChange={(e) =>
              dispatch({ type: 'username', value: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId='Password'>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            minLength='6'
            type='password'
            autoComplete='new-password'
            aria-autocomplete='none'
            value={state.password}
            onChange={(e) =>
              dispatch({ type: 'password', value: e.target.value })
            }
          />
        </Form.Group>
        <Button variant='danger' size='lg' block='block' type='submit'>
          Update User
        </Button>
      </Form>
      <Link to='/admin' className='link-back'>
        Back to admin page
      </Link>
      {state.messages.map((message, i) => {
        return (
          <div
            className={`edit-message ${
              message.ok ? 'message-safe' : 'message-dang'
            }`}
          >
            {message.message}
          </div>
        );
      })}
    </div>
  );
};

export default EditUser;
