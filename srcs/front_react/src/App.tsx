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
import GamePage from "./components/game/GamePage";
import {
  TransitionContext,
  TransitionContextType,
} from "./contexts/TransitionContext";
import PageNotFound from "./components/menu/PageNotFound";
import Profile from "./components/profile/Profile";
import { ToastContainer } from "react-toastify";

export default function App() {
  const { displayLocation } = useContext(
    TransitionContext
  ) as TransitionContextType;

  return (
    <div className="bg">
      <Background />

      <div className="app">
        <Routes location={displayLocation}>
          {/* 404 Page (public) */}
          <Route path="*" element={<PageNotFound />} />
          {/* Auth Routes (public) */}
          <Route path="/auth" element={<LoginPage />} />
          <Route path="/2fa" element={<TwoFactorPage />} />
          {/* Main Routes (private) */}
          <Route path="/" element={<PrivateRoute component={Home} />} />

          <Route
            path="/profile/:id"
            element={<PrivateRoute component={Profile} />}
          />
          <Route
            path="/profile"
            element={<PrivateRoute component={PageNotFound} />}
          />

          <Route path="/chat" element={<PrivateRoute component={Home} />} />
          <Route path="/game" element={<PrivateRoute component={GamePage} />} />
          <Route
            path="/settings"
            element={<PrivateRoute component={Settings} />}
          />
        </Routes>
      </div>
      <ToastContainer toastClassName={"toast"} />
    </div>
  );
}
