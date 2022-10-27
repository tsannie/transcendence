
import { createContext, useState } from "react";
import { socket } from "./Game";

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

  my_id: string;
  op_id: string;
  setmy_id: (id: string) => void;
  setop_id: (id: string) => void;

  im_p2: boolean;
  setim_p2: (im_p2: boolean) => void;
};

export const GameContext = createContext<GameContextType>({
  status: RoomStatus.EMPTY,
  setStatus: () => {},

  room: "",
  setRoom: () => {},

  my_id: "",
  op_id: "",
  setmy_id: () => {},
  setop_id: () => {},

  im_p2: false,
  setim_p2: () => {},

});


interface GameContextProps {
  children: JSX.Element | JSX.Element[];
}

export const GameProvider = ({ children }: GameContextProps) => {
  const [status, setStatus] = useState(RoomStatus.EMPTY);
  const [room, setRoom] = useState("");
  const [my_id, setmy_id] = useState("");
  const [op_id, setop_id] = useState("");
  const [im_p2, setim_p2] = useState(false);

  return (
    <GameContext.Provider
      value={{
        status,
        setStatus,
        room,
        setRoom,

        my_id,
        op_id,
        setmy_id,
        setop_id,

        im_p2,
        setim_p2,
      }}
    >
      {children}
    </GameContext.Provider>
  );
  
}