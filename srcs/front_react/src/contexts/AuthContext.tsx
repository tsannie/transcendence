import React, { createContext, useState } from "react";
import { api } from "../const/const";

export type User = {
  id: number;
  username: string;
  email: string;
  enabled2FA: boolean;
  profile_picture: string;
  channels: any[]; // changer en IUser[] plus tard ou a retirer
  owner_of: any; // changer en IUser plus tard ou a retirer
};

export type AuthContextType = {
  isLogin: boolean;
  user: User | null;
  setUser: (user: User) => void;
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
  const [isLogin, setIsLogin] = useState(false);

  const login = (user: User) => {
    setUser(user);
    setIsLogin(true);
  };

  const logout = () => {
    setUser(null);
    setIsLogin(false);
  };

  return (
    <AuthContext.Provider value={{ isLogin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
