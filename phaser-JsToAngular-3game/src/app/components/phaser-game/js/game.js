import Phaser from 'phaser';

export function initializeGame() {
  const config = {
    type: Phaser.AUTO,//auto rendrerer 2d o 3d grafica
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
       /*  gravity: { y: 200 }, */
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
  const VELOCITY=100;
  function create() {
    //(x,y,chiave dell'immagine) /2 la grandezza del cnvas
    //this.add.image(config.width/2, config.height/2, 'sky');
    // this.add.image(400,300, 'sky').setOrigin(1 ,0.5);
    this.add.image(0,0, 'sky').setOrigin(0);
    bird=this.physics.add.sprite(config.width*0.1, config.height/2, 'bird').setOrigin(0);
    bird.body.velocity.x = VELOCITY; 
    //debugger
  }
  //60fps
  //60*16ms=1000ms
  //t1=200px/s
  //t1=400px/s
  //t1=600px/s
  function update(time,delta) {
    if(bird.x>=config.width - bird.width){
      bird.body.velocity.x= -VELOCITY;
      console.log(bird.body.velocity)
    }else if(bird.x<=0){
      bird.body.velocity.x=VELOCITY;
    }
    
  }
  new Phaser.Game(config);
}