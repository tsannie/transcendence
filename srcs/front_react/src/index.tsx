import React from 'react';
import { createRoot } from "react-dom/client";
import App from './App';
import Register from './Auth/Register';
import UserList from './userlist/UserListItem';

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <App />
    <UserList />
    <Register />
  </React.StrictMode>,
)
