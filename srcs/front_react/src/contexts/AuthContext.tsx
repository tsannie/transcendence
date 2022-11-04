import React, { createContext, useEffect, useState } from "react";
import { api } from "../const/const";

export type User = {
  id: number;
  username: string;
  email: string;
  enabled2FA: boolean;
  profile_picture: string;
  friends: User[];
  friend_requests: User[];
};

export type AuthContextType = {
  isLogin: boolean;
  user: User | null;
  setUser: (user: User) => void;
  setReloadUser: (reload: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
  //monitoringSocket: WebSocket | null;
};

export const AuthContext = createContext<Partial<AuthContextType>>({});

interface IProps {
  children: JSX.Element | JSX.Element[];
}

export const AuthProvider = ({ children }: IProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [reloadUser, setReloadUser] = useState<boolean>(false);

  const login = (user: User) => {
    setUser(user);
    setIsLogin(true);
  };

  const logout = () => {
    setUser(null);
    setIsLogin(false);
  };

  useEffect(() => {
    if (reloadUser && user) {
      api
        .get("auth/profile")
        .then((res) => {
          setUser(res.data);
        })
        .catch((res) => {
          console.log("error update user");
        });
      setReloadUser(false);
    }
  }, [reloadUser]);

  return (
    <AuthContext.Provider
      value={{ isLogin, setReloadUser, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
