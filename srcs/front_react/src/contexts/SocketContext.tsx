import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { api } from "../const/const";
import { MessagesContext } from "./MessagesContext";
import { UserContext } from "./UserContext";

export const SocketContext = createContext<Socket>(io());

interface SocketProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [userid, setUserid] = useState(0);
  const socket = io("http://localhost:4000/chat", {
    query: {
      userId: userid,
    },
  });

  async function getUser() {
    console.log("get user");
    await api
      .get("auth/profile")
      .then((res) => {
        setUserid(res.data.id);
      })
      .catch((res) => {
        console.log("invalid jwt");
      });
  }

  useEffect(() => {
    getUser();
    console.log("socket provider");
    socket.on("connect", () => console.log("connected to socket"));
    socket.on("disconnect", () => console.log("disconnected from socket"));
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
