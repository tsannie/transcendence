import React, { createContext, useEffect, useState } from "react";
import { IChannel } from "../components/chat/types";
import { api } from "../const/const";

export type UserContextType = {
  username: string;
  userid: number;
  setUsername: (username: string) => void;
  users: any[]
};

export const UserContext = createContext<UserContextType>({
  username: "",
  userid: 0,
  setUsername: () => {},
  users: [],
});

interface UserContextProps {
  children: JSX.Element | JSX.Element[];
}

export const UserProvider = ({ children }: UserContextProps) => {
  const [username, setUsername] = useState("");
  const [userid, setUserid] = useState(0);
  const [users, setUsers] = useState<any[]>([]);

  async function getUser() {
    console.log("get user");
    await api
      .get("auth/profile")
      .then((res) => {
        setUsername(res.data.username);
        setUserid(res.data.id);
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
        username,
        setUsername,
        userid,
        users,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
