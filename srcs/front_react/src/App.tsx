import React, { useContext } from "react";
import "./app.style.scss";
import "./components/background/bg.style.scss";
import "./components/menu/menu.style.scss";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./components/auth/oauth/LoginPage";
import TwoFactorPage from "./components/auth/2fa/TwoFactorPage";
import { PrivateRoute } from "./components/routes/PrivateRoute";
import Settings from "./components/settings/Settings";
import Background from "./components/background/Background";
import {
  TransitionContext,
  TransitionContextType,
} from "./contexts/TransitionContext";
import Game from "./components/game/Game";
import PageNotFound from "./components/menu/PageNotFound";
import Profile from "./components/profile/Profile";
import { ToastContainer } from "react-toastify";
import Chat from "./components/chat/Chat";

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

          <Route
            path="/profile/:id"
            element={<PrivateRoute component={Profile} />}
          />
          <Route
            path="/profile"
            element={<PrivateRoute component={PageNotFound} />}
          />

          <Route path="/chat" element={<PrivateRoute component={Chat} />} />
          <Route path="/" element={<PrivateRoute component={Game} />} />
          <Route
            path="/settings"
            element={<PrivateRoute component={Settings} />}
          />
        </Routes>
      </div>
      <ToastContainer
        autoClose={2000}
        toastClassName={"toast"}
        pauseOnFocusLoss={false}
      />
    </div>
  );
}
