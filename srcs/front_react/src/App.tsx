import React, { useState } from 'react';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Chat from './components/chat/Chat';
import Sidebar from './components/sidebar/Sidebar';
import UserList from './userlist/UserListItem';

export default function App() {

  const [inputChat, setInputChat] = useState(false);

  return (
    <div className='app'>
      <Sidebar inputChat={inputChat} setInputChat={setInputChat}/>
      <div className='chat-clicked'>
        { !inputChat ? <div></div> : <Chat />}
      </div>
    </div>
  );
}
