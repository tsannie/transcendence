import {
  Box, Grid
} from "@mui/material";

import React, { useEffect, useState } from "react";

import ButtonLogin from "./Auth/ButtonLogin";
import Chat from "./components/chat/Chat";
import Sidebar from "./components/sidebar/Sidebar";
import UserList, { api, IUser } from "./userlist/UserList";
import LogoIcon from "./assets/logo-project.png";
import { COOKIE_NAME } from "./const";

export default function App() {
  const [inputChat, setInputChat] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [users, setUsers] = React.useState<Array<IUser>>([]);

  async function getAllUsers() {
    await api
      .get("user")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((res) => {
        console.log("invalid jwt");
        console.log(res);
      });
  }

  //console.log(isLogin);
  if (document.cookie.includes(COOKIE_NAME))
  {
    api.get('auth/profile').then(res => {
      setIsLogin(true);
    }).catch(res => {
      console.log('invalid jwt');
      console.log(res)
      document.cookie = COOKIE_NAME + '=; Max-Age=-1;;';
    });
  }

  useEffect(() => {
    const strIsLogin = JSON.parse(window.localStorage.getItem("isLogin") || "null");
    setIsLogin(strIsLogin);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("isLogin", JSON.stringify(isLogin));
  }, [isLogin]);

  if (!isLogin)
    return (
      <Box
        sx={{
          bgcolor: "rgba(0, 0, 0, 0.70)",
          height: "100vh",
          pt: "2vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img src={LogoIcon}></img>
        </Box>
        <ButtonLogin isLogin={isLogin} setIsLogin={setIsLogin} users={users} getAllUsers={getAllUsers}/>
      </Box>
    );
  return (
    <Grid
      container
    >
      <Grid item >
        <Sidebar
          inputChat={inputChat}
          setInputChat={setInputChat}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
        />
      </Grid>
      <Grid item xs={11} sx={{
        ml: "72px",
      }}>
        {inputChat && <Chat getAllUsers={getAllUsers} users={users}/>}
      </Grid>
    </Grid>
  );
}
