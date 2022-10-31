import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext, AuthContextType } from "./AuthContext";

export const SocketContext = createContext(null);

interface SocketProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { user } = useContext(AuthContext) as AuthContextType;
  const [ message, setMessage ] = useState(null);

  const socket = io("http://localhost:4000/chat", {
    query: {
      userId: user?.id,
    },
  });

  useEffect(() => {
    if (socket)
    {
      socket.on("connect", () => console.log("connected to socket"));
      socket.on("message", (data) => {
          console.log("DATA IN PROVIDER = ", data);
          setMessage(data);
    })
    };

    return ( () => {
      socket.off("connect");
      socket.off("message");
    })
  }, []);

  return (
    <SocketContext.Provider value={message}>{children}</SocketContext.Provider>
  );
};
