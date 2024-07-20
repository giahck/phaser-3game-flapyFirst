import Phaser from 'phaser';

export function initializeGame() {
  const config = {
    type: Phaser.AUTO,//auto rendrerer 2d o 3d grafica
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 400 },
       /*  gravity: { x: 200 }, */
        debug: true
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };

  
  function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('bird', 'assets/bird.png');
  }
  
  let bird = null;
  let totalDelta=null;
  const initlBiirdPosition = {x: config.width*0.1, y: config.height/2};
  const flapVelocity = 250;
  function create() {
    //(x,y,chiave dell'immagine) /2 la grandezza del cnvas
    //this.add.image(config.width/2, config.height/2, 'sky');
    // this.add.image(400,300, 'sky').setOrigin(1 ,0.5);
    this.add.image(0,0, 'sky').setOrigin(0);
    bird=this.physics.add.sprite(config.width*0.1, config.height/2, 'bird').setOrigin(0);
   // bird.body.velocity.x = VELOCITY; 
   this.input.on('pointerdown', flap);
   let spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  spaceBar.on('down', flap);
  }
  //60fps
  //60*16ms=1000ms
  //t1=200px/s 
  //t1=400px/s
  //t1=600px/s
  function update(time,delta) {
    if(bird.y>config.height || bird.y< -bird.height){
      restartBirdPosiition();
  }
}
  function restartBirdPosiition(){
    bird.x=initlBiirdPosition.x;
    bird.y=initlBiirdPosition.y;
    bird.body.velocity.y=0;
  }
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
  function flap() {
    bird.body.velocity.y = -flapVelocity;
   // bird.body.gravity.y = 200;
    console.log('flap')
  }
  new Phaser.Game(config);
}