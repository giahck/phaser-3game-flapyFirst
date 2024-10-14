import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";
import ScoreScene from "./scenes/ScoreScene";
import PreloadScene from "./scenes/PreloadScene";
import PauseScene from "./scenes/PauseScene";
import Multiplayer from "./scenes/Multiplayer";
import { pipe } from "rxjs";
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 800;
const WIDTH = isMobile ? window.innerWidth-50 : 800;
console.log(`Larghezza dello schermo: ${WIDTH}`);
const HEIGHT = 600;
const BIRD_POSITION = { x: WIDTH * 0.1, y: HEIGHT / 2 };
const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION,
};
const Scenes = [PreloadScene, MenuScene,Multiplayer, ScoreScene, PlayScene, PauseScene];
const createScenes = (Scene, cv) => new Scene(SHARED_CONFIG, cv);
const initScenes = (cv) => Scenes.map((Scene) => createScenes(Scene, cv));
let multiplayerSceneForWeb;
let gameInstance = null;
export function initializeGame(container, cv) {
  cleanupGame();
  const config = {
    
    type: Phaser.AUTO, // auto renderer 2D o 3D grafica
    parent: container,
    pixelArt: true,
    ...SHARED_CONFIG,
    physics: {
      default: "arcade",
      arcade: {
        //  debug: true
      },
    },
    scene: initScenes(cv),
    callbacks: {
      postBoot: (game) => {
        multiplayerSceneForWeb = game.scene.getScene('Multiplayer');
      }
    }
  };

  gameInstance = new Phaser.Game(config);

}
export function cleanupGame() {
  if (gameInstance) {
    //console.log("cleanupGame");
    multiplayerSceneForWeb.shutdown()
    gameInstance.destroy(true);
    gameInstance = null;
  }
}
/* const VELOCITY = 200; 
 const PIPES_TO_RENDER = 4;
  let bird = null;
  let pipes = null;
const pipeVerticalDistyRange = [150, 250];
const pipeHorizontalDistyRange = [500, 550];
let pipeHorizontalDisty=0;

  let totalDelta=null;

  const initlBiirdPosition = {x: config.width*0.1, y: config.height/2};
  const flapVelocity = 250;

  function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');
  }
  function create() {
    //(x,y,chiave dell'immagine) /2 la grandezza del cnvas
    //this.add.image(config.width/2, config.height/2, 'sky');
    // this.add.image(400,300, 'sky').setOrigin(1 ,0.5);
    this.add.image(0,0, 'sky').setOrigin(0);
    bird=this.physics.add.sprite(config.width*0.1, config.height/2, 'bird').setOrigin(0);
     bird.body.gravity.y = 400;

    pipes = this.physics.add.group();

   for(let i=0; i<PIPES_TO_RENDER; i++){
    const upperPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 1);
    const lowerPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 0);
    placePipe(upperPipe, lowerPipe);
  }
  pipes.setVelocityX(-200);
 */

// bird.body.velocity.x = VELOCITY;
/*  this.input.on('pointerdown', flap);
   let spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  spaceBar.on('down', flap);
  }
  function update(time,delta) {
    if(bird.y>config.height || bird.y< -bird.height){
      restartBirdPosiition();
  }
  ricicloPipe();
}
function placePipe(uPipe, lPipe) {
  const  rightMostX = getRightMostPipe();
  let pipeVerticalDisty = Phaser.Math.Between(...pipeVerticalDistyRange);
  let pipeVerticalPosition = Phaser.Math.Between(0 + 20, config.height - 20 - pipeVerticalDisty);
  const pipeHorizontalDisty = Phaser.Math.Between(...pipeHorizontalDistyRange);

  uPipe.x = rightMostX + pipeHorizontalDisty;
  uPipe.y = pipeVerticalPosition;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDisty; 
}
function ricicloPipe(uPipe, lPipe) {
  const temp=[];
  pipes.getChildren().forEach(pipe => {
    if(pipe.getBounds().right <= 0){
      temp.push(pipe);
      if(temp.length === 2){
        placePipe(...temp);
      }
    }
  });
}

function getRightMostPipe() {
let rightMostX = 0;
pipes.getChildren().forEach(function(pipe) {
  rightMostX = Math.max(pipe.x, rightMostX);
});
return rightMostX;

}
  function restartBirdPosiition(){
    bird.x=initlBiirdPosition.x;
    bird.y=initlBiirdPosition.y;
    bird.body.velocity.y=0;
  }

  function flap() {
    bird.body.velocity.y = -flapVelocity;
   // bird.body.gravity.y = 200;
    console.log('flap')
  } */
/*  new Phaser.Game(config);
} */

/*  function update(time,delta) {//sotto
    if (bird.y >= config.height - bird.height-10) {
      bird.y = config.height - bird.height-10; 
      bird.body.velocity.y = 0; 
      bird.body.gravity.y = 0.2; 
    } 
    else if (bird.y <= 0) { //sopra
      bird.y = 0;   
      bird.body.velocity.y = VELOCITY;  
      bird.body.gravity.y = 600;  
    }
  } */
