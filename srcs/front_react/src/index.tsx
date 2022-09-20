import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import App from "./App";

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
