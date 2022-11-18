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
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect((): ReturnType<EffectCallback> => {
    if (user) {
      const newSocket: any = io("http://localhost:4000/game", {
        transports: ["websocket"],
      });
      setSocket(newSocket);
      return () => newSocket.disconnect(); // disconnect old socket
    }
  }, [user]); // create a new socket when user changes only

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => console.log("connected to socket"));

      socket.on("connect_error", (err) => {
        console.log(`|||||||||||connect_error due to ${err.message}`);
      });
      socket.on("disconnect", () => console.log("disconnected from socket"));

      return () => {
        socket.off("connect");
        socket.off("connect_error");
        socket.off("disconnect");
      };
    }
  }, []);

  return (
    <SocketGameContext.Provider value={socket}>
      {children}
    </SocketGameContext.Provider>
  );
};
