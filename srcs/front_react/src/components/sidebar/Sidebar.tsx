import { useState } from "react";
import { isJsxAttribute, JsxElement } from "typescript";
import Chat from "../chat/Chat";
import LogoIcon from "../../assets/logo-project.png";
import HomeIcon from "../../assets/home.png";
import ProfileIcon from "../../assets/profile.png";
import GameIcon from "../../assets/game.png";
import ChatIcon from "../../assets/chat.png";
import SettingsIcon from "../../assets/settings.png";
import ExitIcon from "../../assets/exit.png";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import ButtonLogout from "../../Auth/ButtonLogout";

export default function Sidebar(props: any) {
  //const [displayGame, setDisplayGame] = useState(false);
  //const [displaySettings, setDisplaySettings] = useState(false);
  // chat icon color: #610D7E

  return (
    <Grid
      spacing={10}
      alignItems="center"
      container
      direction="column"
      sx={{
        maxWidth: "fit-content",
        maxHeight: "fit-content",
      }}
    >
      <Grid item sx={{}}>
        <img src={LogoIcon}></img>
      </Grid>
      <Grid item sx={{}}>
        <img src={HomeIcon}></img>
      </Grid>
      <Grid item sx={{}}>
        <img src={ProfileIcon}></img>
      </Grid>
      <Grid item sx={{}}>
        <img src={GameIcon}></img>
      </Grid>
      <Grid item sx={{}}>
        <img src={ChatIcon} onClick={() => props.setInputChat(true)}></img>
      </Grid>
      <Grid item sx={{}}>
        <img src={SettingsIcon}></img>
      </Grid>
      <Grid item sx={{}}>
        <img src={ExitIcon} onClick={() => props.setIsLogin(false)}></img>
      </Grid>
    </Grid>
  );
}
