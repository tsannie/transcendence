
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../../contexts/AuthContext";
import { SocketGameContext } from "../../contexts/SocketGameContext";

export enum RoomStatus {
  EMPTY,
  WAITING,
  PLAYING,
  CLOSED,
}

export type GameContextType = {
  status: number;
  setStatus: (status: number) => void;

  room: string;
  setRoom: (room: string) => void;

  isP2: boolean;
  setisP2: (isP2: boolean) => void;
};

export const GameContext = createContext<GameContextType>({
  status: RoomStatus.EMPTY,
  setStatus: () => {},

  room: "",
  setRoom: () => {},


  isP2: false,
  setisP2: () => {},
});

interface GameContextProps {
  children: JSX.Element | JSX.Element[];
}

export const GameProvider = ({ children }: GameContextProps) => {
  const [status, setStatus] = useState(RoomStatus.EMPTY);
  const [room, setRoom] = useState("");
  const [isP2, setisP2] = useState(false);
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketGameContext);

  useEffect(() => {
    socket.on("leftRoom", (theroom: any) => {
      setStatus(theroom.status);
    });

    socket.on("leftRoomEmpty", () => {
      setStatus(RoomStatus.EMPTY);   
    });
  }, [socket]);

  useEffect(() => {
    socket.on("joinedRoom", (theroom: any) => {
      setStatus(theroom.status);
      setRoom(theroom.id);
      console.log("theroomxxxxxxxxxxxxxxxxx", theroom);
      if (theroom.p2 && theroom.p2.username === user?.username) {
        console.log("user is p2");
        setisP2(true);
      } else if (theroom.p1.username === user?.username) {
        console.log("user is p1");
        setisP2(false);
      }
    });
  }, [socket]);

  return (
    <GameContext.Provider
      value={{
        status,
        setStatus,
        room,
        setRoom,

        isP2,
        setisP2,
      }}
    >
      {children}
    </GameContext.Provider>
  );
  
}