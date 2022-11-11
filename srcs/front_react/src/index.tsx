import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { TransitionProvider } from "./contexts/TransitionContext";
import "react-toastify/dist/ReactToastify.css";
import "./app.style.scss";
import "./toastify.style.scss";
import { ChatDisplayProvider } from "./contexts/ChatDisplayContext";

const root = createRoot(document.getElementById("root")!);

root.render(
  <BrowserRouter>
    <AuthProvider>
      <TransitionProvider>
        <ChatDisplayProvider>
          <App />
        </ChatDisplayProvider>
      </TransitionProvider>
    </AuthProvider>
  </BrowserRouter>
);
