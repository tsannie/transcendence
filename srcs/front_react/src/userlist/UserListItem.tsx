
import React, { useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/'
})

export interface IUser {
  id?: number,
  name?: string,
}

export default function UserList() {

  // Declare a new state variable
  const [name, setName] = React.useState('');
  const [id, setId] = React.useState(0);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');


  function getUser() {
    api.get('/user').then(res => {
      //console.log(res.data)
      console.log(res.data);
      setId(res.data[0].id);
      setName(res.data[0].name);
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
      <li key={id}>{name}</li>
        <ul>
          <li>{email}</li>
          <li>{password}</li>
        </ul>
    </ul>
  )
}
