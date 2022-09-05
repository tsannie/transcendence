import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import Darkmode from "./App";
import ButtonLogin from './Auth/Login';
import ButtonLogout from './Auth/Logout';
import UserList from './userlist/UserListItem';
import App from "./App";
import Chat from "./components/chat/Chat";
import PostList from "./userlist/UserListItem";
import Login from "./Auth/Login";

const root = createRoot(document.getElementById("root")!);

//    <App />
//    <Register />

root.render(<App />);
/* root.render(
  <React.StrictMode>
    <UserList />
    <ButtonLogin />
    <ButtonLogout />
  </React.StrictMode>,
) */
