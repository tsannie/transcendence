import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { COOKIE_NAME, REDIRECT_LINK_AUTH } from "../const";
import { api } from "../userlist/UserListItem";

export default function ButtonLogout(props: any) {
  function linkLog(event: any) {
    props.setIsLogin(false);
    console.log("dans logout");
    event.preventDefault();
    window.location.href = REDIRECT_LINK_AUTH;
  }

  return <button onClick={linkLog}> Logout</button>;
}
