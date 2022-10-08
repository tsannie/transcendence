import React, { createContext, useEffect, useState } from "react";
import { IChannel } from "../components/chat/types";
import { api } from "../const/const";

export type UserContextType = {
  username: string;
  userid: number;
  setUsername: (username: string) => void;
};

export const UserContext = createContext<UserContextType>({
  username: "",
  userid: 0,
  setUsername: () => {},
});

interface UserContextProps {
  children: JSX.Element | JSX.Element[];
}

export const UserProvider = ({ children }: UserContextProps) => {
  const [username, setUsername] = useState("");
  const [userid, setUserid] = useState(0);

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

  // get all User
  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        userid,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
