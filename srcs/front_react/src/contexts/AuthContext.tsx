import React, { createContext, useState } from "react";
import { api } from "../const/const";

export type User = {
  id: number;
  username: string;
  email: string;
  enabled2FA: boolean;
  profile_picture: string;
}

export type AuthContextType = {
  isLogin: boolean;
  user: User | null;
  setUser: (user: User) => void;
  login: (user: User) => void;
  logout: () => void;
  users: any[];
  getAllUsers: () => {},
  //monitoringSocket: WebSocket | null;
}

export const AuthContext = createContext<Partial<AuthContextType>>({});

interface IProps {
  children: JSX.Element | JSX.Element[];
}

export const AuthProvider = ({ children }: IProps) => {

  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const login = (user: User) => {
    setUser(user);
    setIsLogin(true);
  }

  const logout = () => {
    setUser(null);
    setIsLogin(false);
  }

  async function getAllUsers() {
    await api
      .get("user")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((res) => {
        console.log("invalid jwt");
        console.log(res);
      });
  }

  return (

    <AuthContext.Provider value={{ isLogin, user, login, logout, users, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );

}
