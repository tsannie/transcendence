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
import { Home } from "@material-ui/icons";


export default function App() {
    //<AuthProvider>

  return (
    <div className="app">

      {/* Auth Routes (public) */}
      <Routes>
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/2fa" element={<TwoFactorPage/>} />
      </Routes>

      {/* Main Routes (private) */}
      <div className="menu">
      <Sidebar/>
        <div className="content">
        <Routes>
          <Route path="/" element={<PrivateRoute component={Home} />}/>
          <Route path="/settings" element={<PrivateRoute component={Settings} />}/>
        </Routes>
        </div>
      </div>
    </div>
  );
}


