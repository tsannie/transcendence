import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import App from "./App";
import Chat from "./components/chat/Chat";
import PostList from "./userlist/UserListItem";
import UserList from "./userlist/UserListItem";
import Darkmode from "./App";

const root = createRoot(document.getElementById("root")!);

//    <App />
//    <Register />

root.render(<App />);
