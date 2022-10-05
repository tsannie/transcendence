import React, { ContextType, useEffect, useState } from "react";
import { api, COOKIE_NAME } from "./const/const";
import Menu from "./components/menu/Menu";
import './app.style.scss'
import { Navigate, Route, Router, Routes } from "react-router-dom";
import { AuthContext, AuthContextType, AuthProvider, User,  } from "./contexts/AuthContext";
import { Switch } from "@mui/material";
import LoginPage from "./components/auth/oauth/LoginPage";
import TwoFactorPage from "./components/auth/2fa/TwoFactorPage";
import { PrivateRoute } from "./components/routes/PrivateRoute";

export default function App() {
    //<AuthProvider>

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<PrivateRoute component={Menu} />}/>
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/2fa" element={<TwoFactorPage/>} />
      </Routes>
    </div>
  );



        {/* { isLogin === false &&
          <LoginPage setIsLogin={setIsLogin}
            is2FA={is2FA}
            isLogin={isLogin}
          />
        }
        {
          isLogin === true &&
          <Menu/>
       <div className="bg">
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
      </div> */}
}


