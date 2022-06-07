import axios from "axios";
import React, { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "../userlist/UserListItem";
import { wait } from "@testing-library/user-event/dist/utils";

interface IFormRegister {
  username: string;
  email: string;
  password: string;
}

export default function Register() {
  const [error, setError] = React.useState(null);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
      isSubmitted,
      isSubmitSuccessful
    }
  } = useForm<IFormRegister>();

  const onSubmit: SubmitHandler<IFormRegister> = async data => {
    console.log(data);
    const ret = await api.post('/user', data)
      .then(response => {
        console.log('success')
        console.log(response)
      }).catch(err => {
        console.log('failed')
        console.log(err)
        setError(err)
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>username:</label>
      <input {...register("username", {
        required: true,
      })} />
      { errors?.username?.type === 'required' && (
        <p>This field is required.</p>
      )}

      <label>email:</label>
      <input {...register("email", {
        required: true
      })} />
      { errors?.email?.type === 'required' && (
        <p>This field is required.</p>
      )}

      <label>password:</label>
      <input {...register("password", {
        required: true
      })} />
      { errors?.password?.type === 'required' && (
        <p>This field is required.</p>
      )}

      <button disabled={isSubmitting} type="submit">
        Register
      </button>
    </form>
  )

}


