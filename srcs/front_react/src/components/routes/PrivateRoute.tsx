import React, { useContext, useEffect, useState } from "react";
import { Route, RouteProps, Navigate } from "react-router-dom";
import { api, COOKIE_NAME } from "../../const/const";
import { AuthContext, AuthContextType, User } from "../../contexts/AuthContext";

interface IPrivateComponentProps {
  component: React.ComponentType;
  path?: string;
}

export const PrivateRoute: React.FC<IPrivateComponentProps> = ({ component: RouteComponent }) => {

  const [isLoad, setIsLoad] = useState(false);
  const [is2FA, setIs2FA] = useState(false);
  const { isLogin, login, user }  = useContext(AuthContext) as AuthContextType;


  useEffect(() => {
    if (document.cookie.includes(COOKIE_NAME)) {
      api.get('auth/isTwoFactor').then(res => {
        setIs2FA(res.data.isTwoFactor);
      }).catch(res => {
        setIsLoad(true);
      });

      api.get('auth/profile').then(res => {
        login(res.data);
        setIsLoad(true);
      }).catch(res => {
        setIsLoad(true);
      });
    } else {
      setIsLoad(true);
    }

  }, []);

  if (isLoad === true) {
    console.log('isLogin', isLogin);
    console.log('is2FA', is2FA);
    if (isLogin)
      return <RouteComponent />;
    else if (is2FA === true)
      return <Navigate to="/2fa" />
    else
      return <Navigate to="/auth" />
  } else {
    return <>loading...</>;
  }
}
