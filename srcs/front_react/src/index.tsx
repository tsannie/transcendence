import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Chat from './components/chat/Chat';
import Message from './components/message/Message';
import PostList from './userlist/UserListItem';
import UserList from './userlist/UserListItem';
import './styles.css'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
