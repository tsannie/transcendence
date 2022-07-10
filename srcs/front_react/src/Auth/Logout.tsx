import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { COOKIE_NAME } from "../const";
import { api } from "../userlist/UserListItem";

export default function ButtonLogout(props: any) {
    document.cookie = COOKIE_NAME + "=; Max-Age=-1;;";
    window.location.reload();
    props.setIsConnected(false);
    console.log("dans logout")
    return (
      <div>

      </div>
    )
}
