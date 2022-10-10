import React, { createContext, useEffect, useState } from "react";
import { IChannel } from "../components/chat/types";
import { api } from "../const/const";
import { ChannelsProvider } from "./ChannelsContext";
import { DmsProvider } from "./DmsContext";
import { MessagesProvider } from "./MessagesContext";
import { UserProvider } from "./UserContext";

export type ChatContextType = {};

export const ChatContext = createContext<ChatContextType>({});

interface ChatContextProps {
  children: JSX.Element | JSX.Element[];
}

export const ChatProvider = ({ children }: ChatContextProps) => {
  return (
    <ChatContext.Provider value={children}>
      <UserProvider>
        <ChannelsProvider>
          <DmsProvider>
            <MessagesProvider>{children}</MessagesProvider>
          </DmsProvider>
        </ChannelsProvider>
      </UserProvider>
    </ChatContext.Provider>
  );
};
