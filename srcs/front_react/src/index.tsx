import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { TransitionProvider } from "./contexts/TransitionContext";
import "react-toastify/dist/ReactToastify.css";
import "./toastify.style.scss";

const root = createRoot(document.getElementById("root")!);

root.render(
  <BrowserRouter>
    <AuthProvider>
      <TransitionProvider>
        <App />
      </TransitionProvider>
    </AuthProvider>
    <ToastContainer />
  </BrowserRouter>
);
