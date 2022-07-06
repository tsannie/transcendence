import React from 'react';
import { createRoot } from "react-dom/client";
import App from './App';
import ButtonLogin from './Auth/Login';
import ButtonLogout from './Auth/Logout';
import UserList from './userlist/UserListItem';

const root = createRoot(document.getElementById("root")!);

//    <App />
//    <Register />

root.render(
  <React.StrictMode>
    <UserList />
    <ButtonLogin />
    <ButtonLogout />
  </React.StrictMode>,
)
