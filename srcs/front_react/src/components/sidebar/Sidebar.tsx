import { useState } from "react";
import HomeIcon from "../../assets/img/icon/home.png";
import ChatIcon from "../../assets/img/icon/chat.png";
import GameIcon from "../../assets/img/icon/game.png";
import SettingsIcon from "../../assets/img/icon/settings.png";
import LogOutIcon from "../../assets/img/icon/log-out.png";
import ProfileIcon from "../../assets/img/icon/user.png";
import { COOKIE_NAME } from "../../const/const";
import './sidebar.style.scss';

export default function Sidebar(props: any) {
  //const [displayGame, setDisplayGame] = useState(false);
  //const [displaySettings, setDisplaySettings] = useState(false);
  // chat icon color: #610D7E

  // to do: passer d'icone en icone en remettant tous les autres state a false




  return (
    <div className="sidebar">
      <div className="sidebar__icon">
        <img src={HomeIcon}></img>
        <img src={ProfileIcon}></img>
        <img src={ChatIcon}></img>
        <img src={GameIcon}></img>
        <img src={SettingsIcon}></img>
        <img src={LogOutIcon}></img>
      </div>
    </div>
  );
}
