import React, { createContext, useEffect, useState } from "react";
import { IChannel } from "../components/chat/types";
import { api } from "../const/const";
import { ChannelsProvider } from "./ChannelsContext";
import { DmsProvider } from "./DmsContext";
import { MessagesProvider } from "./MessagesContext";

export const ChatList = createContext<Partial<IChannel[]>>([]);

interface ChatContextProps {
  children: JSX.Element | JSX.Element[];
}

export function ChatListProvider({ children }: ChatContextProps) {
}
