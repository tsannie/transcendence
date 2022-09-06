import React, { useEffect } from "react";
import axios from "axios";
import { COOKIE_NAME } from "../const";

export const api = axios.create({
  // TODO moove to a constant file
  withCredentials: true,
  baseURL: "http://localhost:4000/",
});

export interface IUser {
  id?: number,
  username?: string,
}

export default function UserList() {

  // Declare a new state variable
  const [username, setUsername] = React.useState('');
  const [id, setId] = React.useState(0);
  const [email, setEmail] = React.useState('');


  async function getUser() {
    if (document.cookie.includes(COOKIE_NAME))
    {
      await api.get('auth/profile').then(res => {
        setId(res.data.id);
        setUsername(res.data.username);
        setEmail(res.data.email);
      }).catch(res => {
        console.log('invalid jwt');
        console.log(res)
        document.cookie = COOKIE_NAME + '=; Max-Age=-1;;';
      });
    }
  }

  // Similar to componentDidMount and componentDidUpdate
    useEffect(() => {
      getUser();
  });

  return (
    <div>
      {username ? <h1 key={id}>{username}/{email}</h1> : <h1>Logout</h1>}
    </div>
  )
}
