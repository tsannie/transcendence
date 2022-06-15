import React from 'react';
import { createRoot } from "react-dom/client";
import App from './App';
import Chat from './components/chat/Chat';
import PostList from './userlist/UserListItem';
import Register from './Auth/Register';
import UserList from './userlist/UserListItem';
import './styles.css'

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <App />
    <UserList />
    <Register />
  </React.StrictMode>,
)
