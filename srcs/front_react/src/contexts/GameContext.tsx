import {
  createContext,
  EffectCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  IException,
  IInfoGame,
  IInvitation,
} from "../components/game/const/const";
import { Room } from "../components/game/types";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { AuthContext, AuthContextType, User } from "./AuthContext";
import { api } from "../const/const";
import { AxiosResponse } from "axios";

export type GameContextType = {
  setReloadInvitations: (reload: boolean) => void;
  setTimeQueue: (time: number) => void;
  timeQueue: number;
  room: Room | null;
  setRoom: (room: Room | null) => void;
  socket: Socket | null;
  setDisplayRender: (display: boolean) => void;
  displayRender: boolean;
  info: IInfoGame | null;
  inviteReceived: IInvitation[];
  friendsLog: User[];
};

export const GameContext = createContext<Partial<GameContextType>>({});

interface GameContextProps {
  children: JSX.Element | JSX.Element[];
}

export const GameProvider = ({ children }: GameContextProps) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [displayRender, setDisplayRender] = useState<boolean>(false);
  const [reloadInvitations, setReloadInvitations] = useState<boolean>(true);
  const [info, setInfo] = useState<IInfoGame>();
  const [inviteReceived, setInviteReceived] = useState<IInvitation[]>([]);
  const [friendsLog, setFriendsLog] = useState<User[]>([]);
  const { user } = useContext(AuthContext) as AuthContextType;

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
    if (socket) {
      socket.on("joinQueue", (message: string) => {
        toast.info(message);
        setTimeQueue(0);
      });

      socket.on("matchFound", (message: string) => {
        setDisplayRender(true);
        toast.success(message);
        setTimeQueue(0);
      });

      socket.on("exception", (data: IException) => {
        toast.error(data.message);
      });

      socket.on("infoGame", (info: IInfoGame) => {
        setInfo(info);
      });

      socket.on("friendsLogin", (friend: User) => {
        const tmp = friendsLog.filter((f) => f.id !== friend.id);
        setFriendsLog([...tmp, friend]);
      });

      socket.on("friendsLogout", (friend: User) => {
        const tmp = friendsLog.filter((f) => f.id !== friend.id);
        setFriendsLog(tmp);

        // remove friend ivitation
        setInviteReceived((inviteReceived: IInvitation[]) =>
          inviteReceived.filter(
            (invite: IInvitation) => invite.user_id !== friend.id
          )
        );
      });

      socket.on("invite", (data: IInvitation) => {
        // check if user is already in the list
        const already_sent = inviteReceived.some(
          (inv) => inv.user_id === data.user_id && inv.mode === data.mode
        );
        if (already_sent) return;

        const tmp = inviteReceived.filter(
          (invitation) => invitation.user_id !== data.user_id
        );
        setInviteReceived([...tmp, data]);
      });

      socket.on("playerNotAvailable", (pseudo: string) => {
        if (room) {
          toast.error(pseudo + " is no longer available");
          setRoom(null);
        }
      });

      socket.on("playerRefuse", (pseudo: string) => {
        if (room) {
          toast.error(pseudo + " refuse your invitation");
          setRoom(null);
        }
      });

      socket.on("cancelInvitation", (room_id: string) => {
        setInviteReceived((inviteReceived: IInvitation[]) =>
          inviteReceived.filter(
            (invite: IInvitation) => invite.room_id !== room_id
          )
        );
      });

      return () => {
        socket.off("joinQueue");
        socket.off("matchFound");
        socket.off("exception");
        socket.off("infoGame");
        socket.off("friendsLogin");
        socket.off("friendsLogout");
        socket.off("invite");
        socket.off("playerNotAvailable");
        socket.off("playerRefuse");
        socket.off("cancelInvitation");
      };
    }
  }, [socket, inviteReceived, friendsLog, room]);

  useEffect(() => {
    if (socket) {
      socket.on("updateGame", (room: Room) => {
        setRoom(room);
      });

      return () => {
        socket.off("updateGame");
      };
    }
  }, [socket]);

  useEffect(() => {
    if (reloadInvitations) {
      api
        .get("/game/friends-log")
        .then((res: AxiosResponse) => {
          setFriendsLog(res.data);
        })
        .catch((err) => {
          console.log(err);
        });

      api
        .get("/game/invitations")
        .then((res: AxiosResponse) => {
          setInviteReceived(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      setReloadInvitations(false);
    }
  }, [user?.friends, room, reloadInvitations]);

  return (
    <GameContext.Provider
      value={{
        room,
        setRoom,
        socket,
        timeQueue,
        setDisplayRender,
        displayRender,
        info,
        inviteReceived,
        friendsLog,
        setTimeQueue,
        setReloadInvitations,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
