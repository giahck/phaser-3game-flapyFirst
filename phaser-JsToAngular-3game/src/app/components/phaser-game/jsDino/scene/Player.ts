import { log } from 'console';
import { GameScene } from './GameScene';
export class Player extends Phaser.Physics.Arcade.Sprite {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  override scene!: GameScene;
  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, 'dino-run');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.init();

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }
  init() {
    this.cursors = this.scene.input.keyboard!.createCursorKeys();
    this.setOrigin(0, 1)
      .setGravityY(5000)
      .setCollideWorldBounds(true)
      .setBodySize(44, 92)
      .setOffset(20, 0)
      .setDepth(1);
    this.registerAnimations();
  }
  override update() {
    const { space,down } = this.cursors;
    const isSpace = Phaser.Input.Keyboard.JustDown(space);
    const isDown = Phaser.Input.Keyboard.JustDown(down);
    const isDownJustUp = Phaser.Input.Keyboard.JustUp(down);
    const onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor();
    //console.log("onFloor", onFloor);
    if (isSpace && onFloor) {
      this.setVelocityY(-1600);
    }
    if (isDown && onFloor) {
      this.body!.setSize(this.body!.width, 58);
      this.setOffset(60, 34);
    }

    if (isDownJustUp && onFloor) {
      this.body!.setSize(44, 92);
      this.setOffset(20, 0);
    }
    if (!this.scene.isGameRunning) {
      this.anims.stop();
      return;
    }
    if (this.body!.deltaAbsY() > 1.4) {
    //   console.log(this.body!.deltaAbsY());
      this.anims.stop();
      this.setTexture('dino-run', 0);
    } else {
      this.playRunAnimation();
    }
    /* console.log("Player update"); */
  }
  playRunAnimation() {
    this.body!.height <= 58 ?
    this.play("dino-down", true) :
    this.play("dino-run", true);
  }
  registerAnimations() {
    this.scene.anims.create({
      key: 'dino-run',
      frames: this.scene.anims.generateFrameNames('dino-run', {
        start: 2,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "dino-down",
      frames: this.anims.generateFrameNames("dino-down"),
      frameRate: 10,
      repeat: -1,
    });
  }
  morto(){
    this.anims.pause;
    this.setTexture('dino-hurt', 0);
  }
}
