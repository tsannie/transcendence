import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import SubmitButton from './components/button/SubmitButton';
import Msg from './components/message/Message';
import PostList from './userlist/UserListItem';
import UserList from './userlist/UserListItem';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <PostList />
    <Msg />
    <SubmitButton />
    <UserList />
  </React.StrictMode>,
  document.getElementById('root')
)
