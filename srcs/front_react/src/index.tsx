import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Register from './Auth/Register';
import UserList from './userlist/UserListItem';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <UserList />
    <Register />
  </React.StrictMode>,
  document.getElementById('root')
)
