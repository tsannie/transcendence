import React, {useEffect, useState} from 'react';
import "./Game.css"
import io from 'socket.io-client';

const socket = io("http://localhost:3000");

export default function Game() {

    const   createGameRoom = () => {
        //socket.emit()
        socket.emit('createGameRoom');

        socket.on("bonjour du serveur", (...args) => {
        // ...
        });
    
    }




    return (
        <div className="Game">
            <button onClick={createGameRoom}> CONNECTION </button>


        </div>

    )
}