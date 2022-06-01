import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io('http://localhost:3000');

function Msg() {
    const [response, setResponse] = useState("msgclient")
   /*  socket.on('connect', () => {
        console.log(socket.id);  
    }); */
    socket.emit('events', { name: 'Nest'});

    return (
    <h1>
        {  }
    </h1>
    );
}
export default Msg;