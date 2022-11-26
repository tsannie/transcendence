import {
  createContext,
  EffectCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { IException, RoomStatus } from "../components/game/const/const";
import { Room } from "../components/game/types";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";

export type GameContextType = {
  timeQueue: number;
  room: Room | null;
  setRoom: (room: Room | null) => void;
  socket: Socket | null;
  setDisplayRender: (display: boolean) => void;
  displayRender: boolean;
};

export const GameContext = createContext<Partial<GameContextType>>({});

interface GameContextProps {
  children: JSX.Element | JSX.Element[];
}

export const GameProvider = ({ children }: GameContextProps) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [displayRender, setDisplayRender] = useState<boolean>(false);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [timeQueue, setTimeQueue] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    interval = setInterval(() => {
      setTimeQueue((time) => time + 10);
    }, 10);
    return () => clearInterval(interval);
  }, []);

  useEffect((): ReturnType<EffectCallback> => {
    const newSocket: any = io("http://localhost:4000/game", {
      transports: ["websocket"],
    });
    setSocket(newSocket);
    return () => newSocket.disconnect(); // disconnect old socket
  }, [setSocket]); // create a new socket only once

  useEffect(() => {
    socket?.on("updateGame", (room: Room) => {
      setRoom(room);
    });

    socket?.on("joinQueue", (message: string) => {
      toast.info(message);
      setTimeQueue(0);
    });

    socket?.on("matchFound", (message: string) => {
      setDisplayRender(true);
      toast.success(message);
      setTimeQueue(0);
    });

    socket?.on("exception", (data: IException) => {
      toast.error(data.message);
    });
  }, [socket]);

  return (
    <GameContext.Provider
      value={{
        room,
        setRoom,
        socket,
        timeQueue,
        setDisplayRender,
        displayRender,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
