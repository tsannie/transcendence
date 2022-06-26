import { useState } from "react";
import { isJsxAttribute, JsxElement } from "typescript";
import Chat from "../chat/Chat";
import "./Sidebar.css";
import Game from "../../assets/game.png";

export default function Sidebar(props: any) {
  //const [displayGame, setDisplayGame] = useState(false);
  //const [displaySettings, setDisplaySettings] = useState(false);

  return (
    <div className="sidebar">
      <div className="logo-project">
        <img src={require("../../assets/logo-project.png")}></img>
      </div>
      <div className="home-icon">
        <img src={require("../../assets/home.png")}></img>
      </div>
      <div className="profile-icon">
        <img src={require("../../assets/profile.png")}></img>
      </div>
      <div className="game-icon">
        <img src={Game}></img>
      </div>
      <div className="chat-icon">
        <img
          src={require("../../assets/chat.png")}
          onClick={() => props.setInputChat(true)}
        ></img>
      </div>
      <div className="settings-icon">
        <img src={require("../../assets/settings.png")}></img>
      </div>
      <div className="exit-icon">
        <img src={require("../../assets/exit.png")}></img>
      </div>
    </div>
  );
}
