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
import Background from "./components/background/Background";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import GamePage from "./components/game/GamePage";
import {
  TransitionContext,
  TransitionContextType,
} from "./contexts/TransitionContext";
import ProfilePlayer from "./components/profile/ProfilePlayer";
import ProfileUser from "./components/profile/ProfileUser";

export default function App() {
  const { displayLocation, location, enableTransition } = useContext(
    TransitionContext
  ) as TransitionContextType;

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
              element={<PrivateRoute component={ProfileUser} />}
            />
            <Route
              path="/profile/:id"
              element={<PrivateRoute component={ProfilePlayer} />}
            />
            <Route path="/chat" element={<PrivateRoute component={Home} />} />
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
