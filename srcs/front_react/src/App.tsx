import React, { useState } from 'react';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Chat from './components/chat/Chat';
import Sidebar from './components/sidebar/Sidebar';
import UserList from './userlist/UserListItem';

export default function App() {

  return (
    <div className='app'>
      <Sidebar />
    </div>
  );
}
