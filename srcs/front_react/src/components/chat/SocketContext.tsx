import React, { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

const socket = io('http://localhost:4000'),
  SocketContext = createContext<Socket>(socket);

socket.on('connect', () => console.log('connected to socket'));

const SocketProvider = ({ children }: any) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
export { SocketContext, SocketProvider };