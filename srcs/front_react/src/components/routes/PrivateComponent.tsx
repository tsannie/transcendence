import React from "react";
import { Route, RouteProps, Navigate } from "react-router-dom";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";

interface IPrivateComponentProps {
  component: React.ComponentType;
  path?: string;
}

export const PrivateRoute: React.FC<IPrivateComponentProps> = ({ component: RouteComponent }) => {

  const { isLogin, user }  = React.useContext(AuthContext) as AuthContextType;
  //console.log('isLogin:', isLogin);
  //console.log('user:', user);

  if (isLogin)
    return <RouteComponent />;
  else
    return <Navigate to="/auth" />
}
