import React, { useState } from "react";
import Settings from "../settings/Settings";
import Sidebar from "../sidebar/Sidebar";
import './menu.style.scss';

export default function Menu() {
  const [selected, setSelected] = useState('');

  return (
    <div className="menu">
      <Sidebar setSelected={setSelected} selected={selected}/>
      <div className="content">
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
          <Settings/>
        }
        { selected == 'logout' &&
          <h1>logout</h1>
        }
      </div>
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
