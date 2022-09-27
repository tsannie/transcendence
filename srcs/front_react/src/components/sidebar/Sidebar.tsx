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
  // chat icon color: #610D7E

  /*border-style: dashed;
  border-color: white;*/

  return (
    <div className="sidebar">
      <div className="sidebar__icon">
        <img src={HomeIcon} onClick={() => props.setSelected('home')} className={props.selected === 'home' ? 'selected' : ''}></img>
        <img src={ProfileIcon} onClick={() => props.setSelected('profile')} className={props.selected === 'profile' ? 'selected' : ''}></img>
        <img src={ChatIcon} onClick={() => props.setSelected('chat')} className={props.selected === 'chat' ? 'selected' : ''}></img>
        <img src={GameIcon} onClick={() => props.setSelected('game')} className={props.selected === 'game' ? 'selected' : ''}></img>
        <img src={SettingsIcon} onClick={() => props.setSelected('settings')} className={props.selected === 'settings' ? 'selected' : ''}></img>
        <img src={LogOutIcon} onClick={() => props.setSelected('logout')} className={props.selected === 'logout' ? 'selected' : ''}></img>
      </div>
    </div>
  );
}
