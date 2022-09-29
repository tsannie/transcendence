import { useState } from "react";
import { isJsxAttribute, JsxElement } from "typescript";
import Chat from "../chat/Chat";
import LogoIcon from "../../assets/logo-project.png";
import HomeIcon from "../../assets/home.png";
import ProfileIcon from "../../assets/profile.png";
import GameIcon from "../../assets/game.png";
import ChatIcon from "../../assets/chat.png";
import SettingsIcon from "../../assets/settings.png";
import ExitIcon from "../../assets/exit.png";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import ButtonLogout from "../../Auth/ButtonLogout";
import { COOKIE_NAME } from "../../const";

export default function Sidebar(props: any) {

  function logout(event: any) {
    event.preventDefault();
    document.cookie = COOKIE_NAME + '=; Max-Age=-1;;';
    props.setIsLogin(false);
    window.location.reload();
  };
  function reinit(str: any) {

      if (str !=="game")
        props.setInputGame(false)
      else
        props.setInputGame(true)
      if (str !=="chat")
        props.setInputChat(false)
      else
        props.setInputChat(true)

  }

  return (
    <Grid
      spacing={10}
      alignItems="center"
      container
      direction="column"
      sx={{
        maxWidth: "fit-content",
        maxHeight: "fit-content",
      }}
    >
      <Grid item sx={{}}>
        <img src={LogoIcon}></img>
      </Grid>
{/*       <Grid item sx={{}}>
        <img src={HomeIcon}></img>
      </Grid>
      <Grid item sx={{}}>
        <img src={ProfileIcon}></img>
      </Grid> */}
      <Grid item sx={{}}>
        <img src={GameIcon} onClick={() => reinit("game")}></img>
      </Grid>
      <Grid item sx={{}}>
        <img src={ChatIcon} onClick={() => reinit("chat")}></img>
      </Grid>
{/*       <Grid item sx={{}}>
        <img src={SettingsIcon}></img>
      </Grid>
      <Grid item sx={{}}>
        <img src={ExitIcon} onClick={logout}></img>
      </Grid> */}
    </Grid>
  );
}
