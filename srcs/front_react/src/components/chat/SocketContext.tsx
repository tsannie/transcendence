import React, { createContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const socket = io('http://localhost:4000', {
  query: {
    userId: 1,
    }
  });

const SocketContext = createContext<Socket>(socket);

interface SocketProviderProps {
  children: React.ReactNode;
}

const SocketProvider = (props: SocketProviderProps) => {

  useEffect(() => {
    console.log('socket provider');
    socket.on('connect', () => console.log('connected to socket'));
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
export { SocketContext, SocketProvider };