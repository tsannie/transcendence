import { MouseEvent, useContext, useEffect, useState } from "react";
import { ReactComponent as HomeIcon } from "../../assets/img/icon/home.svg";
import { ReactComponent as ChatIcon } from "../../assets/img/icon/chat.svg";
import { ReactComponent as GameIcon } from "../../assets/img/icon/play.svg";
import { ReactComponent as SettingsIcon } from "../../assets/img/icon/settings.svg";
import { ReactComponent as LogOutIcon } from "../../assets/img/icon/logout.svg";
import { ReactComponent as ProfileIcon } from "../../assets/img/icon/user.svg";
import { api } from "../../const/const";
import "./sidebar.style.scss";
import { Link } from "react-router-dom";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { MessageContext } from "../../contexts/MessageContext";

export default function Sidebar() {
  const { logout, user } = useContext(AuthContext) as AuthContextType;
  const { newMessage, channelNotification, setChannelNotification } = useContext(MessageContext);
  const path = useLocation().pathname;

  const handleLogout = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    api
      .get("/auth/logout")
      .then(() => {
        toast.info("bye bye !");
        logout();
      })
      .catch(() => {
        logout();
      });
  };

  useEffect(() => {
    if (newMessage && newMessage.author?.id != user?.id && path != "/chat")
      setChannelNotification(true);
  }, [newMessage])

  return (
    <div className="sidebar">
      <div className="sidebar__content">
        <div className="sidebar__icon">
          <Link to={"/profile/" + user?.username}>
            <ProfileIcon
              className={path.slice(0, 8) === "/profile" ? "selected" : ""}
            />
          </Link>
          <Link to="/chat">
            <ChatIcon className={path === "/chat" ? "selected" : ""} onClick={() => {setChannelNotification(false)}} />
            { channelNotification && 
              <div className="notif" style={{}}/>
            }
          </Link>
          <Link to="/game">
            <GameIcon className={path === "/game" ? "selected" : ""} />
          </Link>
          <Link to="/settings">
            <SettingsIcon className={path === "/settings" ? "selected" : ""} />
          </Link>
          <a>
            <LogOutIcon onClick={handleLogout} className="" />
          </a>
        </div>

        <div className="sidebar__bg"></div>
      </div>
    </div>
  );
}
