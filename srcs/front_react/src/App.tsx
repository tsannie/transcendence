import React, { ContextType, useEffect, useState } from "react";
import { api, COOKIE_NAME } from "./const/const";
import Menu from "./components/menu/Menu";
import './app.style.scss'
import { Route, Router, Routes } from "react-router-dom";
import { AuthContext, AuthContextType, AuthProvider, User,  } from "./contexts/AuthContext";
import { Switch } from "@mui/material";
import LoginPage from "./components/auth/oauth/LoginPage";
import TwoFactorPage from "./components/auth/2fa/TwoFactorPage";
import { PrivateRoute } from "./components/routes/PrivateComponent";

export default function App() {
  //const [isLogin, setIsLogin] = useState(false);
  const [is2FA, setIs2FA] = useState(false);

  const { login, user, isLogin }  = React.useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    console.log('upload');
    console.log(user);
    console.log('isLogin', isLogin);
  }, [user]);

  useEffect(() => {
    if (document.cookie.includes(COOKIE_NAME)) {

      api.get('auth/profile').then(res => {
        //console.log(res.data)
        const userData: User = res.data;
        //console.log('user', userData);
        //setUser(userData);
        login(userData);
        //setUser(userData);
        console.log('end login')
      }).catch(res => {
        console.log('invalid jwt'); // TODO LOGOUT FUNCTION
        document.cookie = COOKIE_NAME + '=; Max-Age=-1;;';  // TODO call logout api
      });

      console.log(user);
      //console.log('login', login);

      /*if (is2FA === false) {
        //login();
        setIsLogin(true);
      } else if (is2FA === true) {
        api.get('auth/profile').then(res => {
          setIsLogin(true);
        }).catch(res => {
          setIsLogin(false);
        });
      }*/
    }
  }, []);

  //console.log('userContext');
  //


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


