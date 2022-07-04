import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import Darkmode from "./App";
import App from './App';
import Register from './Auth/Register';
import Game from './game/Game';
import UserList from './userlist/UserListItem';
import App from "./App";
import Chat from "./components/chat/Chat";
import PostList from "./userlist/UserListItem";

const root = createRoot(document.getElementById("root")!);

//    <App />
//    <Register />

root.render(<App />);
root.render(
  <React.StrictMode>
    <UserList />
    <Register />
    <Game/>
    </React.StrictMode>,
)
