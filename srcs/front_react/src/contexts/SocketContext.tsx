import React, { createContext, useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessagesContext } from './MessagesContext';

const socket = io('http://localhost:4000', {
  query: {
    userId: 1,
    }
  });

export const SocketContext = createContext<Socket>(socket);

interface SocketProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const SocketProvider = ({ children }: SocketProviderProps) => {

  useEffect(() => {
    console.log('socket provider');
    socket.on('connect', () => console.log('connected to socket'));
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};