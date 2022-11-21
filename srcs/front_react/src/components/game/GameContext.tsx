import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { SocketGameContext } from "../../contexts/SocketGameContext";
import { RoomStatus } from "./const/const";

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
    if (user && socket) {
      socket.on("joinedRoom", (theroom: any) => {
        setStatus(theroom.status);
        setRoom(theroom.id);
        if (theroom.p2 && theroom.p2.username === user.username) {
          setisP2(true);
        } else if (theroom.p1.username === user.username) {
          setisP2(false);
        }
      });
    }
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
};
