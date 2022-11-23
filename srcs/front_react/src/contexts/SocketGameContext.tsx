import React, {
  createContext,
  EffectCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketGameContext = createContext<Socket | null>(null);

interface SocketGameProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const SocketGameProvider = ({ children }: SocketGameProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect((): ReturnType<EffectCallback> => {
    const newSocket: any = io("http://localhost:4000/game", {
      transports: ["websocket"],
    });
    setSocket(newSocket);
    return () => newSocket.disconnect(); // disconnect old socket
  }, []); // create a new socket only once

  return (
    <SocketGameContext.Provider value={socket}>
      {children}
    </SocketGameContext.Provider>
  );
};
