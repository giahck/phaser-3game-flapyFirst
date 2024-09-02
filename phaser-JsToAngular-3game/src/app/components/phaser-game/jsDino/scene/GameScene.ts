export class GameScene extends Phaser.Scene {
    isGameRunning = false;
    get gameHeight() {
        return +this.game.config.height;
      }
      get gameWidth() {
        return +this.game.config.width ;
      }
      constructor(key: string) {
        super(key);
      }
}