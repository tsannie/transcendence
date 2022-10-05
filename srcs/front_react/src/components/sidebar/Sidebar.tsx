import { useState } from "react";
import Chat from "../chat/Chat";
import LogoIcon from "../../assets/logo-project.png";
//import HomeIcon from "../../assets/home.png";
//import ProfileIcon from "../../assets/profile.png";
//import GameIcon from "../../assets/game.png";
import ChatIcon from "../../assets/chat.png";
import SettingsIcon from "../../assets/settings.png";
import ExitIcon from "../../assets/exit.png";
import { Box } from "@mui/system";
import { Grid, IconButton } from "@mui/material";
import { COOKIE_NAME } from "../../const/const";
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LogoutIcon from '@mui/icons-material/Logout';
import MessageIcon from '@mui/icons-material/Message';

interface SidebarProps {
  setIsLogin: (isLogin: boolean) => void;
  setInputChat: (inputChat: boolean) => void;
}

export default function Sidebar(props: any) {
  //const [displayGame, setDisplayGame] = useState(false);
  //const [displaySettings, setDisplaySettings] = useState(false);
  // chat icon color: #610D7E

  // to do: passer d'icone en icone en remettant tous les autres state a false

  function logout() { // TODO route api logout
    document.cookie = COOKIE_NAME + '=; Max-Age=-1;;';
    props.setIsLogin(false);
    props.setIs2FA(false);
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
      position="fixed"
      sx={{
        maxWidth: "fit-content",
        maxHeight: "fit-content",
      }}
    >
      <Grid item sx={{}}>
        <img src={LogoIcon}></img>
      </Grid>
      <Grid item sx={{}}>
        <IconButton aria-label="home">
          <HomeIcon />
        </IconButton>
      </Grid>
      <Grid item sx={{}}>
        <IconButton aria-label="profile">
          <AccountCircleIcon />
        </IconButton>
      </Grid>
      <Grid item sx={{}}>
        <IconButton aria-label="game">
          <SportsEsportsIcon />
        </IconButton>
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
