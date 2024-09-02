import { AfterViewInit, Component, OnInit } from '@angular/core';
import { cleanupGame, initializeGame } from './js/game';
import {  cleanupGameDino, initializeGameDino } from './jsDino/gameDino';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-phaser-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './phaser-game.component.html',
  styleUrls: ['./phaser-game.component.scss']
})
export class PhaserGameComponent implements OnInit,AfterViewInit {
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
  constructor() { }

  ngOnInit(): void {
    // Eventuali inizializzazioni necessarie
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
      initializeGame(container);
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
      // Inizializza il gioco all'interno dell'elemento selezionato
      initializeGameDino(gameContainer);
    }
  }
}


