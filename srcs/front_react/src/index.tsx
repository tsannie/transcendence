import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import Darkmode from "./App";
import UserList from './userlist/UserList';
import App from "./App";
import Chat from "./components/chat/Chat";
import PostList from "./userlist/UserList";

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
