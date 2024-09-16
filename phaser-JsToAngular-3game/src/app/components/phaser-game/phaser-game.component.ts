import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { cleanupGame, initializeGame } from './js/game';
import {  cleanupGameDino, initializeGameDino } from './jsDino/gameDino';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Cv } from '../../models/cv/cv.interface';
import { CvService } from '../../service/cv.service';
import { WebsocketService } from '../../service/websocket.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-phaser-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './phaser-game.component.html',
  styleUrls: ['./phaser-game.component.scss']
})
export class PhaserGameComponent implements OnInit,AfterViewInit,OnDestroy {
  cvSubscription!: Subscription;
  cv!:Cv;
  visibilityGame = true;
  imageClicked = false;
 
  isImageClicked = false;
 
  selectedImageIndex: number | null = null;
  selectedImageTemp: number | null = null;


  images = [
    { src: './../../../assets/sky.png', game: 'initializeGame' },
    { src: './../../../assets/assetsDino/moon.png', game: 'initializeGameDino' },
      
      // Aggiungi altre immagini qui
  ];
  constructor(private coc:CookieService,private cvSrv:CvService,private webSocketService: WebsocketService) { }

  ngOnInit(): void {
    this.cvSrv.getCV();
    this.cvSubscription=this.cvSrv.cvUser$.subscribe(
      (cv)=>{
        this.cv=cv;
       // console.log(this.cv);
      }
    );
/*     const token = localStorage.getItem('accessToken') || this.coc.get('accessToken');
    this.webSocketService.init(token);
    this.webSocketService.onMessage((message: string) => {
      console.log('Message from server:', message);      
    }); */
  }

 /*  sendMessage() {
    console.log('Sending message to server');
    this.webSocketService.sendMessage('Hello from Angular!');
  } */

  ngOnDestroy() {
    this.webSocketService.disconnect();
  }
  selectImage(index: number): void {
    if (this.selectedImageIndex === index) {
      this.selectedImageIndex = null;
      this.visibilityGame = false;
      this.cleanupCurrentGame();
    } else {
      this.selectedImageTemp = index;
      this.selectedImageIndex = index;
      this.visibilityGame = true;
  
      setTimeout(() => {
        const gameContainer = document.querySelector('.game-container') as HTMLElement;
        if (gameContainer) {
          while (gameContainer.firstChild) {
            gameContainer.removeChild(gameContainer.firstChild);
          }
          this.initializeSelectedGame(gameContainer, this.images[index].game);
        }
      }, 0);
    }
  }
  
  initializeSelectedGame(container: HTMLElement, game: string): void {
    
    if (game === 'initializeGame') {
      initializeGame(container,this.cv);
    } else if (game === 'initializeGameDino') {
      initializeGameDino(container, this.cv);
    }
  }

  cleanupCurrentGame(): void {
    if (this.selectedImageTemp !== null) {
      const game = this.images[this.selectedImageTemp].game;
      if (game === 'initializeGame') {
        cleanupGame();
      } else if (game === 'initializeGameDino') {
        cleanupGameDino();
      }
    }
  }
  ngAfterViewInit(): void {
    const gameContainer = document.querySelector('.game-container')as HTMLElement;
    if (gameContainer) {
    
     /*  console.log(this.cv); */
      setTimeout(() => {
       /*  console.log(this.cv); */
       initializeGame(gameContainer, this.cv);
      }, 500);
  }
}}


