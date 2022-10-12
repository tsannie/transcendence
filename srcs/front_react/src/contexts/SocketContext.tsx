import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { api } from '../const/const';
import { MessagesContext } from './MessagesContext';
import { UserContext } from './UserContext';

export const SocketContext = createContext<Socket>(io());

interface SocketProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const SocketProvider = ({ children }: SocketProviderProps) => {

  const [userid, setUserid] = useState(0);

  async function getUser() {
    console.log("get user");
    await api
      .get("auth/profile")
      .then((res) => {
        setUserid(res.data.id);
      })
      .catch((res) => {
        console.log("invalid jwt");
      });
  }

  const socket = io('http://localhost:4000', {
  query: {
    userId: userid,
    }
  });

  useEffect(() => {
    getUser();
    console.log('socket provider');
    socket.on('connect', () => console.log('connected to socket'));
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};