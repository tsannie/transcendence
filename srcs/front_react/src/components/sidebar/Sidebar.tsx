import { useState } from "react";
import { isJsxAttribute, JsxElement } from "typescript";
import Chat from "../chat/Chat";
import "./Sidebar.css";
import LogoIcon from "../../assets/logo-project.png";
import HomeIcon from "../../assets/home.png";
import ProfileIcon from "../../assets/profile.png";
import GameIcon from "../../assets/game.png";
import ChatIcon from "../../assets/chat.png";
import SettingsIcon from "../../assets/settings.png";
import ExitIcon from "../../assets/exit.png";
import { Box } from "@mui/system";
import { green } from "@mui/material/colors";
import { Drawer } from "@mui/material";

export default function Sidebar(props: any) {
  //const [displayGame, setDisplayGame] = useState(false);
  //const [displaySettings, setDisplaySettings] = useState(false);

  return (
    <Drawer
      anchor="left"
      variant="persistent"
      sx={{
        width: 88,
        height: 1024,
      }}
    >
      <Box sx={{ display: "flex", mb: 10, justifyContent: "center" }}>
        <img src={LogoIcon}></img>
      </Box>
      <Box sx={{ display: "flex", mb: 10, justifyContent: "center" }}>
        <img src={HomeIcon}></img>
      </Box>
      <Box sx={{ display: "flex", mb: 10, justifyContent: "center" }}>
        <img src={ProfileIcon}></img>
      </Box>
      <Box sx={{ display: "flex", mb: 10, justifyContent: "center" }}>
        <img src={GameIcon}></img>
      </Box>
      <Box sx={{ display: "flex", mb: 10, justifyContent: "center" }}>
        <img src={ChatIcon} onClick={() => props.setInputChat(true)}></img>
      </Box>
      <Box sx={{ display: "flex", mb: 10, justifyContent: "center" }}>
        <img src={SettingsIcon}></img>
      </Box>
      <Box sx={{ display: "flex", mb: 10, justifyContent: "center" }}>
        <img src={ExitIcon}></img>
      </Box>
    </Drawer>
  );
}
