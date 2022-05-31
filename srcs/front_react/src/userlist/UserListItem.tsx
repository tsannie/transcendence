
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

  // Similar to componentDidMount and componentDidUpdate

  function getUser() {
    api.get('/user').then(res => {
      //console.log(res.data)
      console.log(res.data[0])
      setId(res.data[0].id);
      setName(res.data[0].name);
     })
    }

    useEffect(() => {
      getUser();
  });

  return (
    <ul>
      <li key={id}>{name}</li>
    </ul>
  )
}
