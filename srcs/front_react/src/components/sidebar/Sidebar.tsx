import { useState } from "react";
import HomeIcon from "../../assets/img/icon/home.png";
import ChatIcon from "../../assets/img/icon/chat.png";
import GameIcon from "../../assets/img/icon/game.png";
import SettingsIcon from "../../assets/img/icon/settings.png";
import LogOutIcon from "../../assets/img/icon/log-out.png";
import ProfileIcon from "../../assets/img/icon/user.png";
import { COOKIE_NAME } from "../../const/const";
import "./sidebar.style.scss";
import { Link } from "react-router-dom";

export default function Sidebar(props: any) {
  //const [displayGame, setDisplayGame] = useState(false);
  // chat icon color: #610D7E

  /*border-style: dashed;
  border-color: white;*/

  return (
    <div className="sidebar">
      <nav className="sidebar__icon">
        <Link to="/">
          <img src={HomeIcon}></img>
        </Link>
        <Link to="/profile">
          <img src={ProfileIcon}></img>
        </Link>
        <Link to="/chat">
          <img src={ChatIcon}></img>
        </Link>
        <Link to="/game">
          <img src={GameIcon}></img>
        </Link>
        <Link to="/settings">
          <img src={SettingsIcon}></img>
        </Link>
        <Link to="/logout">
          <img src={LogOutIcon}></img>
        </Link>
      </nav>
    </div>
  );
}
