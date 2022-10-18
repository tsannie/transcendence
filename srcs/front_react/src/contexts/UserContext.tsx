import React, { createContext, useEffect, useState } from "react";
import { IChannel } from "../components/chat/types";
import { api } from "../const/const";

export type UserContextType = {
  users: any[];
  userConnected: any;
  setUserConnected: (users: any[]) => void;
  getUser: () => void;
  getAllUsers: () => void;
};

export const UserContext = createContext<UserContextType>({
  users: [],
  userConnected: {},
  setUserConnected: () => {},
  getUser: () => {},
  getAllUsers: () => {},
});

interface UserContextProps {
  children: JSX.Element | JSX.Element[];
}

export const UserProvider = ({ children }: UserContextProps) => {
  const [users, setUsers] = useState<any[]>([]);
  const [userConnected, setUserConnected] = useState<any[]>([]);

  async function getUser() {
    console.log("get user");
    await api
      .get("auth/profile")
      .then((res) => {
        //console.log("user connected = ", res.data);
        setUserConnected(res.data);
      })
      .catch((res) => {
        console.log("invalid jwt");
      });
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

  // get all User
  useEffect(() => {
    getUser();
    getAllUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        userConnected,
        setUserConnected,
        getUser,
        getAllUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
