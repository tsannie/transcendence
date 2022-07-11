import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import Paperplane from "../../assets/paperplane.png";

export default function PromptMessage(props: any) {
  return (
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
          props.setCurrentMessage(event.target.value);
        }}
      />
      <Box
        component="img"
        alt="send message img"
        src={Paperplane}
        onClick={props.sendMessage}
        sx={{
          width: 18,
          height: 18,
          position: "absolute",
          bottom: 0,
        }}
      ></Box>
    </Box>
  );
}
