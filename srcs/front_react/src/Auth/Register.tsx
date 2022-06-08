import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "../userlist/UserListItem"; // TODO replace to constant value

interface IFormRegister {
  username: string;
  email: string;
  password: string;
}

export default function Register() {
  const [errorUsername, setErrorUsername] = React.useState('');
  const [errorEmail, setErrorEmail] = React.useState('');
  const [errorPassword, setErrorPassword] = React.useState('');

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

    setErrorUsername('');
    setErrorEmail('')
    setErrorPassword('');

    await api.post('/auth/register', data)
      .then(response => {
        console.log('success')
        console.log(response)
      }).catch(err => {
        console.log('failed')
        const allError = err.response.data.message;
        allError.forEach((element: string) => {
          if (element.startsWith('email')) {
            setErrorEmail(element.substring(6));
          } else if (element.startsWith('username')) {
            setErrorUsername(element.substring(9));
          } else if (element.startsWith('password')) {
            setErrorPassword(element.substring(9));
          }
        });
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
      {
        errorUsername && <p>{errorUsername}</p>
      }

      <label>email:</label>
      <input {...register("email", {
        required: true
      })} />
      { errors?.email?.type === 'required' && (
        <p>This field is required.</p>
      )}
      { errorEmail && <p>{errorEmail}</p> }


      <label>password:</label>
      <input {...register("password", {
        required: true
      })} />
      { errors?.password?.type === 'required' && (
        <p>This field is required.</p>
      )}
      { errorPassword && <p>{errorPassword}</p> }

      <button disabled={isSubmitting} type="submit">
        Register
      </button>
    </form>
  )

}


