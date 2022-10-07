import React, { ContextType, Fragment, useEffect, useState } from "react";
import { api, COOKIE_NAME } from "./const/const";
import Menu from "./components/menu/Menu";
import './app.style.scss'
import './components/menu/menu.style.scss';
import { Navigate, Route, Router, Routes } from "react-router-dom";
import { AuthContext, AuthContextType, AuthProvider, User,  } from "./contexts/AuthContext";
import { Switch } from "@mui/material";
import LoginPage from "./components/auth/oauth/LoginPage";
import TwoFactorPage from "./components/auth/2fa/TwoFactorPage";
import { PrivateRoute } from "./components/routes/PrivateRoute";
import Settings from "./components/settings/Settings";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./components/home/Home";
import Chat from "./components/chat/Chat";
import Profile from "./components/profile/Profile";


export default function App() {
    //<AuthProvider>

  return (
    <div className="app">
      <Routes>
        {/* Auth Routes (public) */}
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/2fa" element={<TwoFactorPage/>} />

        {/* Main Routes (private) */}
        <Route path="/" element={<PrivateRoute component={Home} />}/>
        <Route path="/profile" element={<PrivateRoute component={Profile} />}/>
        <Route path="/chat" element={<PrivateRoute component={Chat} />}/>
        <Route path="/game" element={<PrivateRoute component={Profile} />}/>
        <Route path="/settings" element={<PrivateRoute component={Settings} />}/>
      </Routes>

    </div>
  );
}


