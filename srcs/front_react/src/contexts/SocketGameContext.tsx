import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { api } from "../const/const";
import { AuthContext } from "./AuthContext";

export const SocketGameContext = createContext<Socket>(io("http://localhost:4000/game"));

interface SocketGameProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const SocketGameProvider = ({ children }: SocketGameProviderProps) => {
  const { user } = useContext(AuthContext);
  const socket = io("http://localhost:4000/game", {
    query: {
      userId: user?.id,
    },
  });

  useEffect(() => {
    console.log("socket game provider");
    socket.on("connect", () => console.log("connected to socket"));

    socket.on("connect_error", (err) => {
      console.log(`|||||||||||connect_error due to ${err.message}`);
    });
  }, [socket]);

  return (
    <SocketGameContext.Provider value={socket}>{children}</SocketGameContext.Provider>
  );
};