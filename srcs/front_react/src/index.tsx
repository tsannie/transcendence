import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import Darkmode from "./App";
import App from './App';
import Game from './game/Game';

import UserList from './userlist/UserListItem';
import Chat from "./components/chat/Chat";
import PostList from "./userlist/UserListItem";

/* const root = createRoot(document.getElementById("root")!);

//    <App />
//    <Register />

root.render(<App />);
root.render(
  <React.StrictMode>
    <UserList />
    <Register />
    <App />
    <UserList />
    <Register />
    <Game/>

    <Sidebar inputChat={inputChat} setInputChat={setInputChat} />
      {inputChat && <Game />}

    </React.StrictMode>,
) */

const root = createRoot(document.getElementById("root")!);

//    <App />
//    <Register />
//    <Login /> TODO delete

root.render(<App />);
