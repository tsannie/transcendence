import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserList from './userlist/UserListItem';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <UserList />
  </React.StrictMode>,
  document.getElementById('root')
)
