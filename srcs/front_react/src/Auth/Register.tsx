import axios from "axios";
import React, { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../userlist/UserListItem";

export default function Register() {
  const [error, setError] = React.useState('');

  //let navigate = useNavigate();

  const handleSubmit = async (event: any) => {
    //console.log(event)
    event.preventDefault();
    /*event.preventDefault();
    let data;
    const formData = new FormData(event.currentTarget);
    const form = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password')
    };
    console.log(form);

    try
    {
      data = await api.post('/user', form);
    }
    catch {
      console.log('crash')
      //console.log("data:" + data);
    }
    console.log(data?.status)*/
    /*if (data.status !== parseInt('400')) {
      setError(data.response)
    } else {
      //localStorage.setItem('token', data.token);
      //setIsLoggedIn(true)
      //navigate('/video')
    }*/
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>username:
        <input name="username" type="text" />
      </label>
      <label>email:
        <input name="email" type="text" />
      </label>
      <label>password:
        <input name="password" type="text" />
      </label>
      <button type="submit">
        Register
      </button>
    </form>
  )

}
