import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
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
    transports: ["websocket"],
  });

  useEffect(() => {
    socket.on("connect", () => console.log("connected to socket"));

    socket.on("connect_error", (err) => {
      console.log(`|||||||||||connect_error due to ${err.message}`);
    });
    socket.on("disconnect", () => console.log("disconnected from socket"));

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
    }
  }, []);

  return (
    <SocketGameContext.Provider value={socket}>{children}</SocketGameContext.Provider>
  );
};