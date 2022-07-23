import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../userlist/UserListItem";

export default function ButtonLogin() {
  function linkLog(event: any) {
    const link = "http://localhost:4000/auth";
    event.preventDefault();
    window.location.href = link;
  }

  return <button onClick={linkLog}>OAuth42</button>;
}
