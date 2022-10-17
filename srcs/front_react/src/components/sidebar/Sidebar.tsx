import { useContext, useEffect, useState } from "react";
import HomeIcon from "../../assets/img/icon/home.svg";
import ChatIcon from "../../assets/img/icon/chat.svg";
import GameIcon from "../../assets/img/icon/play.svg";
import SettingsIcon from "../../assets/img/icon/settings.svg";
import LogOutIcon from "../../assets/img/icon/logout.svg";
import ProfileIcon from "../../assets/img/icon/user.svg";
import { api, COOKIE_NAME } from "../../const/const";
import "./sidebar.style.scss";
import { Link } from "react-router-dom";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom"
import { SnackbarContext, SnackbarContextType } from "../../contexts/SnackbarContext";



export default function Sidebar(props: any) {
  const { logout } = useContext(AuthContext) as AuthContextType;
  const { setMessage, setOpenSnackbar, setSeverity, setAfterReload } =
  useContext(SnackbarContext) as SnackbarContextType;
  const path = useLocation().pathname;

  const handleLogout = () => {
    api.get('/auth/logout')
      .then(res => {
        setMessage('bye bye');
        setSeverity('info');
        setOpenSnackbar(true);
        logout();
      });
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
