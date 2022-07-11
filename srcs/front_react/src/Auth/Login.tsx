import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { REDIRECT_LINK_AUTH } from "../const";
import { api } from "../userlist/UserListItem";

export default function ButtonLogin(props: any) {
  function linkLog(event: any) {
    props.setIsLogin(true);
    console.log("dans login");
    event.preventDefault();
    window.location.href = REDIRECT_LINK_AUTH;
  }

  return <button onClick={linkLog}>OAuth42</button>;
}
