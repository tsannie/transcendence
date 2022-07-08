import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import App from "./App";
import Chat from "./components/chat/Chat";
import PostList from "./userlist/UserListItem";
import Login from "./Auth/Login";
import UserList from "./userlist/UserListItem";
import Darkmode from "./App";
import ButtonLogout from "./Auth/Logout";

const root = createRoot(document.getElementById("root")!);

//    <App />
//    <Register />

root.render(<App />);
