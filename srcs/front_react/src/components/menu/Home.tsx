import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import './home.style.scss';

export default function Home() { // TODO replace home by menu
  const [selected, setSelected] = useState('home');

  return (
    <div className="home">
      <Sidebar setSelected={setSelected} selected={selected}/>
      { selected == 'home' &&
        <h1>home</h1>
      }
      { selected == 'profile' &&
        <h1>profile</h1>
      }
      { selected == 'chat' &&
        <h1>chat</h1>
      }
      { selected == 'game' &&
        <h1>game</h1>
      }
      { selected == 'settings' &&
        <h1>settings</h1>
      }
      { selected == 'logout' &&
        <h1>logout</h1>
      }
    </div>
  );
}

/*          <Box
          sx={{
            display: "flex",
          }}
        >
          <Sidebar
            setInputChat={setInputChat}
            setInputSettings={setInputSettings}
            setIsLogin={setIsLogin}
            setIs2FA={setIs2FA}
          />
          {inputChat && <Chat />}
          {inputSettings && <Settings />}
          </Box> */
