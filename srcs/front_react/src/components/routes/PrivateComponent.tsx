import React from "react";
import { Route, RouteProps, Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

interface IPrivateComponentProps {
  component: React.ComponentType;
  path?: string;
}

export const PrivateRoute: React.FC<IPrivateComponentProps> = ({ component: RouteComponent }) => {

  const isLogin = React.useContext(AuthContext).isLogin;
  //console.log('context', context);

  if (isLogin)
    return <RouteComponent />;
  else
    return <Navigate to="/auth" />
}
