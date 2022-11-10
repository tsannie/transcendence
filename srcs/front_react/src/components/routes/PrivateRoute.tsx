import { AxiosResponse } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api, COOKIE_NAME } from "../../const/const";
import { AuthContext, AuthContextType, User } from "../../contexts/AuthContext";
import {
  TransitionContext,
  TransitionContextType,
} from "../../contexts/TransitionContext";
import Sidebar from "../sidebar/Sidebar";

interface IPrivateComponentProps {
  component: React.ComponentType;
  path?: string;
}

export const PrivateRoute: React.FC<IPrivateComponentProps> = ({
  component: RouteComponent,
}) => {
  const [isLoad, setIsLoad] = useState(false);
  const [is2FA, setIs2FA] = useState(false);
  const { isLogin, login, logout } = useContext(AuthContext) as AuthContextType;
  const { transitionStage, setTransistionStage, setDisplayLocation, location } =
    useContext(TransitionContext) as TransitionContextType;

  useEffect(() => {
    if (document.cookie.includes(COOKIE_NAME)) {
      api
        .get("auth/isTwoFactor")
        .then((res: AxiosResponse) => {
          setIs2FA(res.data.isTwoFactor);
        })
        .catch(() => {
          logout();
          setIsLoad(true);
        });

      api
        .get("auth/profile")
        .then((res: AxiosResponse) => {
          login(res.data);
          setIsLoad(true);
        })
        .catch(() => {
          setIsLoad(true);
        });
    } else {
      logout();
      setIsLoad(true);
    }
  }, [location]);

  if (isLoad === true) {
    if (isLogin) {
      return (
        <div className="menu">
          <Sidebar />
          <div className="content">
            <div className="content__rel">
              <div className="content__bg" />
              <div
                className={`${transitionStage}`}
                onAnimationEnd={() => {
                  if (transitionStage === "exit-up") {
                    setTransistionStage("bounce-in-up");
                    setDisplayLocation(location);
                  } else if (transitionStage === "exit-down") {
                    setTransistionStage("bounce-in-down");
                    setDisplayLocation(location);
                  }
                }}
              >
                <RouteComponent />
              </div>
            </div>
          </div>
        </div>
      );
    } else if (is2FA === true) return <Navigate to="/2fa" />;
    else return <Navigate to="/auth" />;
  } else {
    return <>loading</>;
  }
};
