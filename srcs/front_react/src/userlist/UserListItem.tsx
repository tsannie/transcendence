
import React, { useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/'
})

export interface IUser {
  id: number,
  name: string,
}

export default function UserList(props: IUser) {

  // Declare a new state variable
  const [name, setName] = React.useState('');
  const [id, setId] = React.useState(0);

  // Similar to componentDidMount and componentDidUpdate

  function getUser() {
    api.get('/user').then(res => {
      setId(res.data.id);
      setName(res.data.name);
     })
  }

  useEffect(() => {
    getUser();

  });

  return (
   <ul>
    { this.state.posts.map(post => <li>{post.name}</li>)}
   </ul>
  )
}
