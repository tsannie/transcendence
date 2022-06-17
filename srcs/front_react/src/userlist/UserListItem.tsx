
import React, { useEffect } from 'react';
import axios from 'axios';

export const api = axios.create({   // TODO moove to a constant file
  baseURL: 'http://localhost:4000/'
})

export interface IUser {
  id?: number,
  username?: string,
}

export default function UserList() {

  // Declare a new state variable
  const [username, setUsername] = React.useState('');
  const [id, setId] = React.useState(0);
  const [email, setEmail] = React.useState('');


  function getUser() {
    api.get('/auth/profile').then(res => {
      setId(res.data[0].id);
      setUsername(res.data[0].username);
      setEmail(res.data[0].email);
    })
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
