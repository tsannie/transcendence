import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import PostList from './userlist/UserListItem';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <PostList />
  </React.StrictMode>,
  document.getElementById('root')
)
