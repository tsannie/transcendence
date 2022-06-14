
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
  const [password, setPassword] = React.useState('');


  function getUser() {
    api.get('/user').then(res => {
      //console.log(res.data)
      //console.log(res.data);
      setId(res.data[0].id);
      setUsername(res.data[0].username);
      setEmail(res.data[0].email);
      setPassword(res.data[0].password);
    })
  }

  // Similar to componentDidMount and componentDidUpdate
    useEffect(() => {
      getUser();
  });

  return (
    <ul>
      <li key={id}>{username}</li>
        <ul>
          <li>{email}</li>
          <li>{password}</li>
        </ul>
    </ul>
  )
}
