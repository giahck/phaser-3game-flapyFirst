import { Token } from './../models/registrazione/auth-data';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: Socket;
  
  constructor(private cookieService: CookieService,) {
  }
init(){
  console.log('Initializing WebSocket');
  if (this.socket && this.socket.connected) {
    console.log('WebSocket is already connected');
    return;
  }

  const token = localStorage.getItem('accessToken') || this.cookieService.get('accessToken');
  this.socket = io('http://192.168.1.123:9092', {
    transports: ['websocket'],
    query: { token: token },

  });
 /*  this.socket.onAny((event, ...args) => {
  console.log(event, args);
}); */

  this.socket.on('connect', () => {
    console.log('WebSocket connected');
  });

  /* this.socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  }); */
}
  sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  onMessage(callback: (data: string) => void) {
    this.socket.on('message', callback);
  }

  disconnect() {
    console.log('Disconnecting socket');
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
