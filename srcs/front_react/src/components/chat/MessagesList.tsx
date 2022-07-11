import { Box } from "@mui/system";
import React from "react";

export default function MessagesList(props: any) {
  return (
    <Box
      sx={{
        width: 640,
        height: "fit-content",
        minHeight: 724,
      }}
    >
      <Box>
        {props.messagesList.map((messageData: any) => {
          if (props.author === messageData.author)
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
      </Box>
    </Box>
  );
}
