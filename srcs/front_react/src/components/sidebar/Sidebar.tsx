import { useState } from "react";
import HomeIcon from "../../assets/img/icon/home.png";
import ChatIcon from "../../assets/img/icon/chat.png";
import Chat from "../chat/Chat";
import LogoIcon from "../../assets/logo-project.png";
import ProfileIcon from "../../assets/profile.png";
import GameIcon from "../../assets/game.png";
import SettingsIcon from "../../assets/settings.png";
import ExitIcon from "../../assets/exit.png";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import { COOKIE_NAME } from "../../const/const";
import './sidebar.style.scss';

export default function Sidebar(props: any) {
  //const [displayGame, setDisplayGame] = useState(false);
  //const [displaySettings, setDisplaySettings] = useState(false);
  // chat icon color: #610D7E

  // to do: passer d'icone en icone en remettant tous les autres state a false




  return (
    <div className="sidebar">
      <img src={HomeIcon}></img>
      <img src={ChatIcon}></img>
      <img src={LogoIcon}></img>
      <img src={ProfileIcon}></img>
      <img src={GameIcon}></img>
      <img src={SettingsIcon}></img>
      <img src={ExitIcon}></img>
    </div>

  );
}
