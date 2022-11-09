
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

  im_p2: boolean;
  setim_p2: (im_p2: boolean) => void;
};

export const GameContext = createContext<GameContextType>({
  status: RoomStatus.EMPTY,
  setStatus: () => {},

  room: "",
  setRoom: () => {},


  im_p2: false,
  setim_p2: () => {},
});

interface GameContextProps {
  children: JSX.Element | JSX.Element[];
}

export const GameProvider = ({ children }: GameContextProps) => {
  const [status, setStatus] = useState(RoomStatus.EMPTY);
  const [room, setRoom] = useState("");
  const [im_p2, setim_p2] = useState(false);
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
      setRoom(theroom.room_name);
      console.log("theroom", theroom);
      console.log("user.username = ", user?.username);
      if (theroom.p2 && theroom.p2.username === user?.username) {
        console.log("user is p2");
        setim_p2(true);
      } else if (theroom.p1.username === user?.username) {
        console.log("user is p1");
        setim_p2(false);
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

        im_p2,
        setim_p2,
      }}
    >
      {children}
    </GameContext.Provider>
  );
  
}