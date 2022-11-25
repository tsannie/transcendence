import {
  createContext,
  EffectCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "./AuthContext";
import { RoomStatus } from "../components/game/const/const";
import { Room } from "../components/game/types";
import { io, Socket } from "socket.io-client";

export type GameContextType = {
  room: Room | null;
  setRoom: (room: Room | null) => void;
  socket: Socket | null;
};

export const GameContext = createContext<Partial<GameContextType>>({});

interface GameContextProps {
  children: JSX.Element | JSX.Element[];
}

export const GameProvider = ({ children }: GameContextProps) => {
  const [room, setRoom] = useState<Room | null>(null);

  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect((): ReturnType<EffectCallback> => {
    const newSocket: any = io("http://localhost:4000/game", {
      transports: ["websocket"],
    });
    setSocket(newSocket);
    return () => newSocket.disconnect(); // disconnect old socket
  }, [setSocket]); // create a new socket only once

  useEffect(() => {
    if (user && socket) {
      socket.on("joinedRoom", (room: Room) => {
        setRoom(room);
      });
    }
  }, [socket]);

  return (
    <GameContext.Provider
      value={{
        room,
        setRoom,
        socket,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
