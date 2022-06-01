import { Injectable } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "dgram";

@WebSocketGateway()
export class ChatGateway {

    @WebSocketServer()
    server;

    @SubscribeMessage('events')
    handleEvent(@MessageBody() message: string, 
    @ConnectedSocket() client: Socket): void {
        //this.server.emit('msgserver', 
            //{ name: 'Nest' }, (data) => console.log(data));
        //this.server.emit('events', {name: 'Nest'});
        console.log(message)
        //return message
    }
}