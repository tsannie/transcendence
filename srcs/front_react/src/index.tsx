import React from 'react';
import { createRoot } from "react-dom/client";
import App from './App';
import Login from './Auth/Login';
import Register from './Auth/Register';
import UserList from './userlist/UserListItem';

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <App />
    <UserList />
    <Register />
    <Login />
  </React.StrictMode>,
)
