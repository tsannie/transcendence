import React from "react";
import Sidebar from "../sidebar/Sidebar";
import './home.style.scss';

export default function Home() {
  return (
    <div className="home">
      <Sidebar/>
      <h1>Menu</h1>
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
