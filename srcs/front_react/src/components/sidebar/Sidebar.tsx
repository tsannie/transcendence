import { useState } from 'react';
import Chat from '../chat/Chat';
import './Sidebar.css'



export default function Sidebar(){
  const [inputChat, setInputChat] = useState(false);
  //const [displayGame, setDisplayGame] = useState(false);
  //const [displaySettings, setDisplaySettings] = useState(false);

  function chatAfterClick() {
    console.log("j'ai clique sur le chat");
    setInputChat(true);
  }

  return (
    <div className="sidebar">
      <div className="logo-project">
        <img
          src={require("../../assets/logo-project.png")}>
        </img>
      </div>
      <div className="home">
        <img
          src={require("../../assets/home.png")}>
        </img>
      </div>
      <div className="profile">
        <img
          src={require("../../assets/profile.png")}>
        </img>
      </div>
      <div className="game">
        <img
          src={require("../../assets/game.png")}>
        </img>
      </div>
      <div className="chat">
        <img
          src={require("../../assets/chat.png")}
          onClick={chatAfterClick}>
        </img>
        {inputChat && <Chat />}
      </div>
      <div className="settings">
        <img
          src={require("../../assets/settings.png")}>
        </img>
      </div>
      <div className="exit">
        <img
          src={require("../../assets/exit.png")}>
        </img>
      </div>
    </div>
  )
}
