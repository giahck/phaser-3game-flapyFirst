import { Token } from './../models/registrazione/auth-data';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: Socket;
  
  constructor() {
  }
  init(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.socket && this.socket.connected) {
        console.log('WebSocket is already connected');
        resolve(null);
        return;
      }

      this.socket = io('http://192.168.1.123:9092', {
        transports: ['websocket'],
        query: { token: token },
      });
      this.socket.on('connect', () => {
        console.log('WebSocket connected');
      });
      this.socket.once('infoClient', (infoClient) => {
       /*  console.log('Got infoClient', infoClient); */
        resolve(infoClient);
      });

     /*  this.socket.onAny((...args) => {
        console.log('Got message', args);
        resolve(args);
      }); */

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        reject(error);
      });
    });
  }
  sendInfo(clientInfo: any) {
    this.socket.emit('infoClient', clientInfo);
  }

  onMessage(callback: (data: any) => void) {
    this.socket.on('infoClient', (...data) => {
     /*  console.log('Received infoClient data:', data); */
      callback(data);
    });
  }
  sendStartGame(room: string) {
    console.log(room);
    this.socket.emit('play', room);
  }
  lobyCountdown(callback: (data: any) => void) {
    this.socket.on('countdown', (data) => {
      console.log('Received infoClient data:', data);
      callback(data);
    });
  }
  disconnect() {
    console.log('Disconnecting socket');
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
