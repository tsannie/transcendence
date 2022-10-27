
import { createContext, useEffect, useState } from "react";
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

  useEffect(() => {
    socket.on("leftRoom", (theroom: any) => {
      setStatus(theroom.status);
      setop_id("");
    });

    socket.on("leftRoomEmpty", () => {
      setStatus(RoomStatus.EMPTY);   
      setop_id("");
    });
   // setisFull("");
    socket.on("roomFull", (theroom: any) => {
     // setisFull("This ROOM IS FULL MATE");
    });
  }, [socket]);



  // If the players are ready, start the game

  useEffect(() => {


    socket.on("joinedRoom", (theroom: any) => {

      console.log("theroom.status", theroom.status);
      
      setStatus(theroom.status);
      
       setRoom(theroom.room_name);
      if (theroom.p2 === socket.id) {
        setop_id(theroom.p1);
         setim_p2(true);
      } else if (theroom.p1 === socket.id) {
        setop_id(theroom.p2);
         setim_p2(false);
      }
    });
     //setisFull("");
     setmy_id(socket.id);
  }, [socket]);


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