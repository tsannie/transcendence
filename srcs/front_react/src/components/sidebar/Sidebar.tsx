import { useState } from "react";
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
import { COOKIE_NAME } from "../../const";

export default function Sidebar(props: any) {
  //const [displayGame, setDisplayGame] = useState(false);
  //const [displaySettings, setDisplaySettings] = useState(false);
  // chat icon color: #610D7E

  // to do: passer d'icone en icone en remettant tous les autres state a false

  function logout() { // TODO route api logout
    document.cookie = COOKIE_NAME + '=; Max-Age=-1;;';
    props.setIsLogin(false);
    window.location.reload();
  };

  function resetInput() {
    props.setInputChat(false);
    props.setInputSettings(false);
  }

  function selectInput(propsName: string) {
    resetInput();
    switch (propsName) {
      case "Chat":
        props.setInputChat(true);
        break;
      case "Settings":
        props.setInputSettings(true);
        break;
    }
  }

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
        <img src={ChatIcon} onClick={() => selectInput('Chat')}></img>
      </Grid>
      <Grid item sx={{}}>
        <img src={SettingsIcon} onClick={() => selectInput('Settings')}></img>
      </Grid>
      <Grid item sx={{}}>
        <img src={ExitIcon} onClick={logout}></img>
      </Grid>
    </Grid>
  );
}
