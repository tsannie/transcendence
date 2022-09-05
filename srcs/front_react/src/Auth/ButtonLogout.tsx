import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { COOKIE_NAME, REDIRECT_LINK_AUTH } from "../const";
import { api } from "../userlist/UserListItem";

export default function ButtonLogout(props: any) {
    console.log("aaaaa")
    //event.preventDefault();
    props.setIsLogin(false);

    console.log("dans logout");
    document.cookie = COOKIE_NAME + '=; Max-Age=-1;;';
    window.location.reload();

/*     return (
      <div></div>
    ) */
  //return <button onClick={linkLog}>Logout</button>;
}
