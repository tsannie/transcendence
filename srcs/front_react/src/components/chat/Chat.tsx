import {
  Box,
  Button,
  CssBaseline,
  darkScrollbar,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { createTheme } from "@mui/material/styles";
import { IMessage } from "./types";
import Paperplane from "../../assets/paperplane.png";

const socket = io("http://localhost:4000/chat");

export default function Chat() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [windowChat, setWindowChat] = useState(false);
  const [messagesList, setMessagesList] = useState<Array<IMessage>>([]);
  const [author, setAuthor] = useState("");

  function createRoom() {
    if (username !== "" && room !== "") {
      socket.emit("createRoom", room);
      console.log(`User join room ${room}`);
      setWindowChat(true);
    }
  }

  async function sendMessage() {
    if (currentMessage !== "") {
      const messageData: IMessage = {
        id: uuidv4(),
        room: room,
        author: username,
        content: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          String(new Date(Date.now()).getMinutes()).padStart(2, "0"),
      };
      await socket.emit("addMessage", messageData);
      setMessagesList((list) => [...list, messageData]);
      setCurrentMessage(messageData.content);
      setAuthor(messageData.author);
    }
  }

  // listen message from backend
  useEffect(() => {
    socket.on("addMessage", (data) => {
      console.log(data);
      setMessagesList((list) => [...list, data]);
    });
  }, [socket]);

  if (!windowChat) {
    return (
      <Box sx={{ position: "absolute", top: 0, left: 88 }}>
        <TextField
          variant="outlined"
          placeholder="username"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <TextField
          variant="outlined"
          placeholder="room"
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        />
        <Button sx={{ height: 56 }} variant="contained" onClick={createRoom}>
          Join a room
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "absolute",
        width: 640,
        height: 1024,
        top: 0,
        bottom: 0,
        left: 88,
        borderRight: "1px solid grey",
      }}
    >
      <Box
        sx={{
          width: 640,
          height: 80,
          textAlign: "center",
          borderBottom: "1px solid grey",
        }}
      >
        Live chat
      </Box>
      <Box
        sx={{
          width: 640,
          height: 724,
          borderBottom: "1px solid grey",
        }}
      >
        <Box>
          {messagesList.map((messageData) => {
            if (author === messageData.author)
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
      <Box
        sx={{
          width: "fit-content",
          mx: "auto",
          position: "relative",
        }}
      >
        <TextField
          id="standard-basic"
          variant="outlined"
          placeholder="Enter a message"
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
        />
        <Box
          component="img"
          alt="send message img"
          src={Paperplane}
          onClick={sendMessage}
          sx={{
            width: 18,
            height: 18,
            position: "absolute",
            bottom: 0,
          }}
        ></Box>
      </Box>
    </Box>
  );
}
