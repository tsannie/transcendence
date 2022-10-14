import React, { createContext, useEffect, useState } from "react";
import { IChannel } from "../components/chat/types";
import { api } from "../const/const";

export type UserContextType = {
  //username: string;
  //userid: number;
  //setUsername: (username: string) => void;
  users: any[];
  userConnected: any;
  setUserConnected: (users: any[]) => void;
  getUser: () => void;
};

export const UserContext = createContext<UserContextType>({
  //username: "",
  //userid: 0,
  //setUsername: () => {},
  users: [],
  userConnected: {},
  setUserConnected: () => {},
  getUser: () => {},
});

interface UserContextProps {
  children: JSX.Element | JSX.Element[];
}

export const UserProvider = ({ children }: UserContextProps) => {
  //const [username, setUsername] = useState("");
  //const [userid, setUserid] = useState(0);
  const [users, setUsers] = useState<any[]>([]);
  const [userConnected, setUserConnected] = useState<any[]>([]);

  async function getUser() {
    console.log("get user");
    await api
      .get("auth/profile")
      .then((res) => {
        //setUsername(res.data.username);
        //setUserid(res.data.id);
        console.log("user connected = ", res.data);
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
        //username,
        //setUsername,
        //userid,
        users,
        userConnected,
        setUserConnected,
        getUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
