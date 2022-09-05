import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COOKIE_NAME } from '../const';
import { api } from '../userlist/UserListItem';

export default function ButtonLogout() {

  function linkLog(event: any) {
    event.preventDefault();
    document.cookie = COOKIE_NAME + '=; Max-Age=-1;;';
    window.location.reload();
  };

  return (
    <button onClick={linkLog}>Logout</button>
  );
}
