import Phaser from 'phaser';
const PIPES_TO_RENDER = 4;
const score$ = new Phaser.Events.EventEmitter();
class PlayScene extends Phaser.Scene{

    constructor(config) {
        super('PlayScene');
        this.config = config;

        this.bird = null;
        this.pipes = null;

        this.pipeHorizontalDisty=0;
        this.pipeVerticalDistyRange = [150, 250];
        this.pipeHorizontalDistyRange = [500, 550];
        this.flapVelocity = 300;

        this.score = 0;
        this.scoreText = '';
        this.bestScoreText = '';
        this.scoreSubscription = null;
        this.bestScore = localStorage.getItem('highScore') || 0;
}

    preload(){
        this.load.image('sky', 'assets/sky.png');
        this.load.image('bird', 'assets/bird.png');
        this.load.image('pipe', 'assets/pipe.png');
    }

    create(){
        this.createBg();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createScore();
        this.handleInputs();   
        this.subscribeToScore();
    }

    update(){
        this.checkGameStatus();
        this.ricicloPipe();
    }
    createBg(){
        this.add.image(0,0, 'sky').setOrigin(0);
    }
    createBird(){
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setOrigin(0);
        this.bird.body.gravity.y = 600;
        this.bird.setCollideWorldBounds(true);
    }
    createPipes(){
        this.pipes = this.physics.add.group();

        for(let i=0; i<PIPES_TO_RENDER; i++){
         const upperPipe = this.pipes.create(0, 0, 'pipe').setImmovable(true).setOrigin(0, 1);
         const lowerPipe = this.pipes.create(0, 0, 'pipe').setImmovable(true).setOrigin(0, 0);
         this.placePipe(upperPipe, lowerPipe);
        }
        this.pipes.setVelocityX(-200);
    }
    createScore() {
        this.score = 0;
        const bestScore = localStorage.getItem('highScore') || 0;
        this.scoreText = this.add.text(600, 14, `Score: ${0}`, { fontSize: '32px', fill: '#000'});
        this.bestScoreText = this.add.text(600, 52, `Best score: ${bestScore || 0}`, { fontSize: '18px', fill: '#000'});
      }
    handleInputs(){
        this.input.on('pointerdown', this.flap,this);
        let spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceBar.on('down', this.flap,this);
        
    }
    checkGameStatus(){
        if(this.bird.getBounds().bottom >=this.config.height || this.bird.y<=0){
            this.gameOver();
        }
    }


    createColliders() {
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
      }
   placePipe(uPipe, lPipe) {
        const  rightMostX = this.getRightMostPipe();
        const pipeVerticalDisty = Phaser.Math.Between(...this.pipeVerticalDistyRange);
        const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeVerticalDisty);
        const pipeHorizontalDisty = Phaser.Math.Between(...this.pipeHorizontalDistyRange);
      
        uPipe.x = rightMostX + pipeHorizontalDisty;
        uPipe.y = pipeVerticalPosition;
      
        lPipe.x = uPipe.x;
        lPipe.y = uPipe.y + pipeVerticalDisty; 
      }
     
    ricicloPipe() {
        const temp=[];
        this.pipes.getChildren().forEach(pipe => {
          if(pipe.getBounds().right <= 0){
            temp.push(pipe);
            if(temp.length === 2){
              this.placePipe(...temp);
              this.increaseScore();
              
            }
          }
        });
      }
    getRightMostPipe() {
        let rightMostX = 0;
        this.pipes.getChildren().forEach(function(pipe) {
          rightMostX = Math.max(pipe.x, rightMostX);
        });
        return rightMostX;
    }
    saveScore(){
      const bestScoreText = localStorage.getItem('highScore');
      const bestScore = bestScoreText && parseInt(bestScoreText, 10);
  
      if (!bestScore || this.score > bestScore) {
        localStorage.setItem('highScore', this.score);
        this.bestScoreText.setText(`Best score: ${this.score}`);
        this.bestScoreText.setFill('#ff0000');
      }
    }
    gameOver(){
        /* this.bird.x=this.config.startPosition.x;
        this.bird.y=this.config.startPosition.y;
        this.bird.body.velocity.y=0; */
        this.physics.pause();
       this.bird.setTint(0xff0000);
       this.saveScore();
      /*  this.time.addEvent({
         delay: 1000,
         callback: ()=>{
              this.scene.restart();
            },
            loop: false       
       });*/
      } 
      flap() {
        this.bird.body.velocity.y = -this.flapVelocity;
      
        console.log('flap')
      }
      increaseScore() {
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`);
        score$.emit('update', this.score);
      }
      subscribeToScore(){
        score$.on('update', score => {
          console.log(`New Score: ${score}`);
          if (score > this.bestScore) {
            this.bestScoreText.setText(`Best score: ${score}`);
            this.bestScoreText.setFill('#ff0000');
        }
      });
      }
   
        destroy() {
          score$.off('update');
          super.destroy();
        }
    }
export default PlayScene;