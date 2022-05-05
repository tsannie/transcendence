import axios from 'axios';
import React from 'react';

const api = axios.create({
  baseURL: 'http://localhost:4000/'
})

function App() {

  let allUser = {
    username: []
  }

  const ret = api.get('/user').then(res => {
    return res.data;
  })
  console.log(ret)

/*   axios.get('http://localhost:4000/user').then(res => {
    const allUser = res.data;
    console.log(res.data)
  }) */

  return (
    <h1>Hello react !</h1>
  );
}

export default App;
