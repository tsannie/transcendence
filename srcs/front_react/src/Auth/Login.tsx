import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { REDIRECT_LINK_AUTH } from '../const';
import { api } from '../userlist/UserListItem';

export default function ButtonLogin() {

  function linkLog(event: any) {
    event.preventDefault();
    window.location.href = REDIRECT_LINK_AUTH;
  };

  return (
    <button onClick={linkLog}>OAuth42</button>
  );
}
