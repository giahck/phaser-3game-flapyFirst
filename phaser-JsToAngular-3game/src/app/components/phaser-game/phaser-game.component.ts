import { AfterViewInit, Component, OnInit } from '@angular/core';
import { cleanupGame, initializeGame } from './js/game';
import {  cleanupGameDino, initializeGameDino } from './jsDino/gameDino';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Cv } from '../../models/cv/cv.interface';
import { CvService } from '../../service/cv.service';
@Component({
  selector: 'app-phaser-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './phaser-game.component.html',
  styleUrls: ['./phaser-game.component.scss']
})
export class PhaserGameComponent implements OnInit,AfterViewInit {
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
  constructor(private cvSrv:CvService) { }

  ngOnInit(): void {
    this.cvSrv.getCV();
    this.cvSubscription=this.cvSrv.cvUser$.subscribe(
      (cv)=>{
        this.cv=cv;
       // console.log(this.cv);
      }
    );
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
      initializeGameDino(container);
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
    // Seleziona l'elemento con la classe 'game-container'
    const gameContainer = document.querySelector('.game-container')as HTMLElement;
    if (gameContainer) {
      // Imposta un timer di 1 secondo prima di inizializzare il gioco
      console.log(this.cv);
      setTimeout(() => {
        // Inizializza il gioco all'interno dell'elemento selezionato
        console.log(this.cv);
        initializeGame(gameContainer, this.cv);
      }, 500);
  }
}}


