import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Msg from './chat/Chat';
import PostList from './userlist/UserListItem';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <PostList />
    <Msg />
  </React.StrictMode>,
  document.getElementById('root')
)
