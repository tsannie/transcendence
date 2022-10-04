import React from "react";
import { Route, RouteProps, Navigate } from "react-router-dom";

interface IPrivateComponentProps {
  component: React.ComponentType;
  path?: string;
}

export const PrivateRoute: React.FC<IPrivateComponentProps> = ({ component: RouteComponent }) => {
  /* const auth = 1;

  if (auth === 0)
    return <RouteComponent />;
  else */
    return <Navigate to="/auth" />
}
