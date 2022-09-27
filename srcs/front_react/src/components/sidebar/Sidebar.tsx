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
  const [selected, setSelected] = useState('home');
  // chat icon color: #610D7E

  /*border-style: dashed;
  border-color: white;*/

  return (
    <div className="sidebar">
      <div className="sidebar__icon">
        <img src={HomeIcon} onClick={() => setSelected('home')} className={selected == 'home' ? 'selected' : ''}></img>
        <img src={ProfileIcon} onClick={() => setSelected('profile')} className={selected == 'profile' ? 'selected' : ''}></img>
        <img src={ChatIcon} onClick={() => setSelected('chat')} className={selected == 'chat' ? 'selected' : ''}></img>
        <img src={GameIcon} onClick={() => setSelected('game')} className={selected == 'game' ? 'selected' : ''}></img>
        <img src={SettingsIcon} onClick={() => setSelected('settings')} className={selected == 'settings' ? 'selected' : ''}></img>
        <img src={LogOutIcon} onClick={() => setSelected('logout')} className={selected == 'logout' ? 'selected' : ''}></img>
      </div>
    </div>
  );
}
