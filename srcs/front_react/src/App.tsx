import React, { useContext, useEffect, useState } from "react";
import "./app.style.scss";
import "./components/background/bg.style.scss";
import "./components/menu/menu.style.scss";
import { Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./components/auth/oauth/LoginPage";
import TwoFactorPage from "./components/auth/2fa/TwoFactorPage";
import { PrivateRoute } from "./components/routes/PrivateRoute";
import Settings from "./components/settings/Settings";
import Home from "./components/home/Home";
import Profile from "./components/profile/Profile";
import { AnimatePresence } from "framer-motion"; // TODO delete ?
import Background from "./components/background/Background";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import GamePage from "./components/game/GamePage";
import Chat from "./components/chat/Chat";
import { TransitionContext, TransitionContextType } from "./contexts/TransitionContext";

export default function App() {

  const {displayLocation} = useContext(TransitionContext) as TransitionContextType;

  return (

    <div className="bg">
      <Background />

      <div className="app">
        <SnackbarProvider>
          <Routes location={displayLocation}>
            {/* Auth Routes (public) */}
            <Route path="/auth" element={<LoginPage />} />
            <Route path="/2fa" element={<TwoFactorPage />} />

            {/* Main Routes (private) */}
            <Route path="/" element={<PrivateRoute component={Home} />} />
            <Route
              path="/profile"
              element={<PrivateRoute component={Profile} />}
            />
            <Route path="/chat" element={<PrivateRoute component={Chat} />} />
            <Route
              path="/game"
              element={<PrivateRoute component={GamePage} />}
            />
            <Route
              path="/settings"
              element={<PrivateRoute component={Settings} />}
            />
          </Routes>
        </SnackbarProvider>
      </div>
    </div>
  );
}
