import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { SocketProvider } from "./contexts/SocketContext";
import { TransitionProvider } from "./contexts/TransitionContext";

const root = createRoot(document.getElementById("root")!);

root.render(
  <BrowserRouter>
    <AuthProvider>
      <TransitionProvider>
        <App />
      </TransitionProvider>
    </AuthProvider>
  </BrowserRouter>
);
