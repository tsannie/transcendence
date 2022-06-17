import React from 'react';
import { createRoot } from "react-dom/client";
import App from './App';
import Login from './Auth/Login';
import ButtonLogin from './Auth/Login copy';
import Register from './Auth/Register';
import UserList from './userlist/UserListItem';

const root = createRoot(document.getElementById("root")!);

//    <App />
//    <Register />
//    <Login /> TODO delete

root.render(
  <React.StrictMode>
    <UserList />
    <ButtonLogin />
  </React.StrictMode>,
)
