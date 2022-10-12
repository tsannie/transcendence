import React, { createContext, useState } from "react";

export type User = {
  id: number;
  username: string;
  email: string;
  enabled2FA: boolean;
}

export type AuthContextType = {
  isLogin: boolean;
  user: User | null;
  setUser: (user: User) => void;
  login: (user: User) => void;
  logout: () => void;
  //monitoringSocket: WebSocket | null;
}

export const AuthContext = createContext<Partial<AuthContextType>>({});

interface IProps {
  children: JSX.Element | JSX.Element[];
}

export const AuthProvider = ({ children }: IProps) => {

  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(false);

  const login = (user: User) => {
    setIsLogin(true);
    setUser(user);
  }

  const logout = () => {
    setIsLogin(false);
    setUser(null);
  }

  return (

    <AuthContext.Provider value={{ isLogin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

}