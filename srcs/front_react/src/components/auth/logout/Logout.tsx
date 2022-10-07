import React, { useContext, useEffect } from 'react';
import { api } from '../../../const/const';
import { AuthContext, AuthContextType } from '../../../contexts/AuthContext';

function Logout() {

  const { logout } = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    api.get('/auth/logout')
      .then(res => {
        logout();
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  return (
    <>
      bye
    </>
  );
}

export default Logout;
