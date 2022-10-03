import { Box } from "@mui/system";
import React from "react";
import { IMessage } from "../types";

interface MessagesListProps {
  messagesList: IMessage[];
  username: string;
}

export default function MessagesList(props: MessagesListProps) {
  return (
    <Box
      sx={{
        border: "1px solid black",
        x: 20,
      }}
    >
      <>
        {props.messagesList.map((messageData: IMessage) => {
          if (props.username === messageData.author)
            return (
              <Box
                sx={{
                  width: "fit-content",
                  height: "fit-content",
                  backgroundColor: "#064fbd",
                  color: "white",
                  fontFamily: "sans-serif",
                  fontSize: 16,
                  borderRadius: 12,
                  ml: "auto",
                  mr: 0.5,
                  mb: 1,
                  p: 1,
                }}
                key={messageData.id}
              >
                {messageData.content}
              </Box>
            );
          return (
            <Box
              sx={{
                width: "fit-content",
                height: "fit-content",
                backgroundColor: "#f1f1f1",
                color: "black",
                fontFamily: "sans-serif",
                fontSize: 16,
                borderRadius: 12,
                ml: 0.5,
                mr: "auto",
                mb: 1,
                p: 1,
              }}
              key={messageData.id}
            >
              {messageData.content}
            </Box>
          );
        })}
      </>
    </Box>
  );
}
