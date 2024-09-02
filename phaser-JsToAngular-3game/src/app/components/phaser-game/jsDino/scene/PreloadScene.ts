import Phaser from "phaser";
import { PRELOAD_CONFIG } from '../gameDino';
class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }
  preload(){
    this.load.image('ground', './assetsDino/ground.png');
    this.load.image('dino-idle', './assetsDino/dino-idle-2.png');
    this.load.image('dino-hurt', './assetsDino/dino-hurt.png');
    this.load.image("restart", "./assetsDino/restart.png");
    this.load.image("game-over", "./assetsDino/game-over.png");
    for (let i = 0; i < PRELOAD_CONFIG.cactusesCount; i++) {
      this.load.image(`obstacle-${i+1}`, `./assetsDino/cactuses_${i+1}.png`);
    }
     this.load.spritesheet("dino-run", "assetsDino/dino-run.png", {
      frameWidth: 88,
      frameHeight: 94
    });

    this.load.spritesheet("dino-down", "assetsDino/dino-down-2.png", {
      frameWidth: 118,
      frameHeight: 94
    });
    this.load.spritesheet("enemy-bird", "assetsDino/enemy-bird.png", {
      frameWidth: 92,
      frameHeight: 77
    });
  }
  create(){
    this.scene.start('PlayScene');
  }
}
export default PreloadScene;