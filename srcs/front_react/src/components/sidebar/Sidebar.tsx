import { useContext, useEffect, useState } from "react";
import HomeIcon from "../../assets/img/icon/home.png";
import ChatIcon from "../../assets/img/icon/chat.png";
import GameIcon from "../../assets/img/icon/game.png";
import SettingsIcon from "../../assets/img/icon/settings.png";
import LogOutIcon from "../../assets/img/icon/log-out.png";
import ProfileIcon from "../../assets/img/icon/user.png";
import { api, COOKIE_NAME } from "../../const/const";
import "./sidebar.style.scss";
import { Link } from "react-router-dom";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom"



export default function Sidebar(props: any) {
  //const [displayGame, setDisplayGame] = useState(false);
  // chat icon color: #610D7E

  /*border-style: dashed;
  border-color: white;*/
  const { logout } = useContext(AuthContext) as AuthContextType;
  const path = useLocation().pathname;



  const handleLogout = () => {
    api.get('/auth/logout')
      .then(res => {
        logout();
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }


  return (
    <div className="sidebar">
      <nav className="sidebar__icon">
        <Link to="/">
          <img src={HomeIcon} className={path === '/' ? 'selected' : ''}></img>
        </Link>
        <Link to="/profile">
          <img src={ProfileIcon} className={path === '/profile' ? 'selected' : ''}></img>
        </Link>
        <Link to="/chat">
          <img src={ChatIcon} className={path === '/chat' ? 'selected' : ''}></img>
        </Link>
        <Link to="/game">
          <img src={GameIcon} className={path === '/game' ? 'selected' : ''}></img>
        </Link>
        <Link to="/settings">
          <img src={SettingsIcon} className={path === '/settings' ? 'selected' : ''}></img>
        </Link>
        <img src={LogOutIcon} onClick={handleLogout}></img>
      </nav>
    </div>
  );
}
