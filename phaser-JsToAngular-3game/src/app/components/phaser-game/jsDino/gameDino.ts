import Phaser from 'phaser';
import PreloadScene from './scene/PreloadScene';
import PlayScene from './scene/PlayScene';
import { Cv } from '../../../models/cv/cv.interface';
let gameInstance: Phaser.Game | null = null;

export const PRELOAD_CONFIG = {
  cactusesCount: 6,
  birdsCount: 1
}
export function initializeGameDino(container: HTMLElement,cv:Cv){
  cleanupGameDino();
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    //0,0
    //0,340
    width: 1000,
  height: 340,
  pixelArt: true,
  transparent: true,
    parent: container,
    physics: {
      default: 'arcade',
      arcade: {
        debug: true
      }
    },
    scene: [PreloadScene,new PlayScene(cv)]
  };

  gameInstance=new Phaser.Game(config);
  const canvas = container.querySelector('canvas');
  if (canvas) {
    canvas.id = 'phaser-canvas';
    console.log('canvas.id', canvas.id);
    const style = document.createElement('style');
    style.innerHTML = `
      #phaser-canvas {
        border: 2px solid black;
      }
    `;
  
   
    document.head.appendChild(style);
  }
}
export function cleanupGameDino() {
    if (gameInstance) {
      console.log('cleanupGameDino');
      gameInstance.destroy(true);
      gameInstance = null;
    }
  }
