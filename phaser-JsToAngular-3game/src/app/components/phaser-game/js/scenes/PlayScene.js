import BaseScene from "./BaseScene";
let PIPES_TO_RENDER = 4;
const score$ = new Phaser.Events.EventEmitter();
class PlayScene extends BaseScene {
  constructor(config, cv) {
    super("PlayScene", config);
  //  cv=[]
    this.cv = cv || { esperienze: [], formazioni: [] };
    this.esperienzeFormazioni = [
      ...(this.cv.esperienze ? this.cv.esperienze.map((item) => ({ ...item, tipo: "ESPERIENZA" })) : []),
      ...(this.cv.formazioni ? this.cv.formazioni.map((item) => ({ ...item, tipo: "FORMAZIONE" })) : []),
    ];
    this.bird = null;
    this.pipes = null;
    this.isPaused = false;
    this.isGameRunning = true;
    this.texts = null;
    this.pipeHorizontalDisty = 0;
    this.flapVelocity = 300;

    this.score = 0;
    this.scoreText = "";
    this.bestScoreText = "";
    this.scoreSubscription = null;
    this.bestScore = localStorage.getItem("highScore") || 0;

    this.currentDifficulty = "easy";
    this.difficulties = {
      easy: {
        pipeHorizontalDistanceRange: [600, 750],
        pipeVerticalDistanceRange: [150, 250],
      },
      normal: {
        pipeHorizontalDistanceRange: [280, 330],
        pipeVerticalDistanceRange: [140, 190]
      },
      hard: {
        pipeHorizontalDistanceRange: [250, 310],
        pipeVerticalDistanceRange: [50, 100],
      },
    };
  }

  /*  preload(){
        this.load.image('sky', 'assets/sky.png');
        this.load.image('bird', 'assets/bird.png');
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('pause', 'assets/pause.png');
    } */

  create() {
    if (this.esperienzeFormazioni.length >= 2) {
      PIPES_TO_RENDER = this.esperienzeFormazioni.length;
    }
    this.prevTextdiferent = Math.abs(this.esperienzeFormazioni.length - 1 - 6); //7 é la dificolta normal
    this.isGameRunning = true;
    /*  this.createBg(); */
    this.currentDifficulty = "easy";
    super.create();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.createPause();
    this.handleInputs();
    this.subscribeToScore();
    this.listenToEvents();
    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("bird", { start: 9, end: 15 }),
      frameRate: 8,
      repeat: -1,
    });
    this.bird.play("fly");
    this.anims.create({
      key: "hit",
      frames: [{ key: "bird", frame: 16 }], // Assumendo che il frame 16 sia l'immagine di collisione
      frameRate: 1,
      repeat: 0,
    });
  }

  update() {
    this.checkGameStatus();
    this.ricicloPipe();
  }
  listenToEvents() {
    if (this.pauseEvent) {
      return;
    }

    this.pauseEvent = this.events.on("resume", () => {
      this.initialTime = 3;

      this.input.off("pointerdown", this.flap, this);
      if (this.countDownText) {
        this.countDownText.destroy();
      }
      if (this.timedEvent) {
        this.timedEvent.remove();
      }
      this.countDownText = this.add
        .text(
          this.screenCenter[0],
          this.screenCenter[1] + 200,
          "Fly in: " + this.initialTime,
          this.fontOptions
        )
        .setOrigin(0.5, 0);
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true,
      });
    });
  }
  countDown() {
    this.initialTime--;
    this.countDownText.setText("Fly in: " + this.initialTime);
    if (this.initialTime <= 0) {
      this.countDownText.setText("");
      this.physics.resume();
      this.timedEvent.remove();
      this.handleInputs();
      this.isPaused = false;
    }
  }
  createBg() {
    this.add.image(0, 0, "sky").setOrigin(0);
  }
  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setFlipX(true)
      .setScale(2)
      .setOrigin(0);
    this.bird.setBodySize(this.bird.width, this.bird.height - 8);
    this.bird.body.gravity.y = 600;
    this.bird.setCollideWorldBounds(true);
    this.bird.setDepth(10);
  }
  removeInputs() {
    /*  if (this.spaceBar) {
           this.spaceBar.off('down', this.flap, this);
       } */
    this.input.off("pointerdown", this.flap, this);
  }
  createPipes() {
    this.pipes = this.physics.add.group();
    this.texts = this.add.group();
    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);
      this.placePipe(upperPipe, lowerPipe, i);
    }
    this.pipes.setVelocityX(-150);
  }
  createScore() {
    this.score = 0;
    const bestScore = localStorage.getItem("highScore") || 0;
    this.scoreText = this.add.text(600, 14, `Score: ${0}`, {
      fontSize: "32px",
      fill: "#000",
    });
    this.bestScoreText = this.add.text(
      600,
      52,
      `Best score: ${bestScore || 0}`,
      { fontSize: "18px", fill: "#000" }
    );
  }
  createPause() {
    this.isPaused = false;
    const pauseButton = this.add
      .image(this.config.width - 10, this.config.height - 10, "pause")
      .setInteractive()
      .setScale(3)
      .setOrigin(1);

    pauseButton.on("pointerdown", () => {
      this.isPaused = true;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch("PauseScene");
    });
  }
  handleInputs() {
    let spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    spaceBar.on("down", this.flap, this);
    this.input.on("pointerdown", this.flap, this);
  }
  checkGameStatus() {
    if (
      this.bird.getBounds().bottom >= this.config.height ||
      this.bird.y <= 0
    ) {
      this.gameOver();
    }
  }
  viewCVcolide() {
    const { nome, cognome, indirizzo, email, telefono } = this.cv;
    // Crea un array con le righe di testo
    const cvLines = [
      `Nome: ${nome}`,
      `Cognome: ${cognome}`,
      `Indirizzo: ${indirizzo}`,
      `email: ${email}`,
      `Tel: ${telefono}`,
    ];

    // Stile del testo
    const textStyle = {
      fontSize: "40px",
      fill: "#FCF118", // Colore viola
      fontWeight: "bold",
    };

    // Calcola la posizione di partenza per il testo centrato verticalmente
    const startY = this.config.height / 2 - (cvLines.length * 40) / 2;
    this.add
      .text(this.config.width / 2, 50, this.cv.titolo, {
        fontSize: "50px",
        fill: "#FCF118", // Colore viola
        fontWeight: "bold",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5, 0);
    // Aggiungi ogni riga di testo
    cvLines.forEach((line, index) => {
      this.add
        .text(this.config.width / 2, startY + index * 50, line, textStyle)
        .setOrigin(0.5, 0.5);
    });
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }
  placePipe(uPipe, lPipe, i) {
   
    const difficulty = this.difficulties[this.currentDifficulty];
    const rightMostX = this.getRightMostPipe();
    const pipeVerticalDisty = Phaser.Math.Between(
      ...difficulty.pipeVerticalDistanceRange
    );
    const pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      this.config.height - 20 - pipeVerticalDisty
    );
    const pipeHorizontalDisty = Phaser.Math.Between(
      ...difficulty.pipeHorizontalDistanceRange
    );

    uPipe.x = rightMostX + pipeHorizontalDisty;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDisty;
    //visualizazzione dei dati cv.
    if (this.prevTextdiferent >= 0&& this.esperienzeFormazioni.length > 0) {
      if (i === undefined) {
        i = Math.floor(Math.random() * this.esperienzeFormazioni.length);
      }
      const { nome, tipo, luogo, descrizione, dataInizio, dataFine } =
        this.esperienzeFormazioni[i];
      const cvLines = [
        ` ${tipo}\n`,
        `${nome}\n\n`,
        `${luogo}\n\n`,
        `${descrizione}\n\n`,
        `${dataInizio}  ${dataFine}`,
      ];
      const textX = uPipe.x + uPipe.width + 300;
      const textY = 50;
      const concatenatedText = cvLines.join(" ");
      cvLines.forEach((line, index) => {
        const text = this.add
          .text(textX, textY, concatenatedText, {
            fontSize: "32px",
            fill: "#ffffff",
            wordWrap: { width: pipeHorizontalDisty - 100 },
          })
          .setOrigin(0.5, 0);

        this.texts.add(text);
      });
    }
  }

  ricicloPipe() {
    const temp = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        temp.push(pipe);
        //    console.log(temp);
        if (temp.length === 2) {
          this.prevTextdiferent--;
          this.increaseScore();
          this.increaseDifficulty();
          this.placePipe(...temp);
        }
      }
    });
    if (this.isGameRunning && !this.isPaused) {
      this.texts.getChildren().forEach((text) => {
        text.x -= (150 * this.game.loop.delta) / 1000;
      });
    }
  }
  increaseDifficulty() {
    if (this.score === 6) {
      //console.log("normal");
      this.currentDifficulty = "normal";
    }
    if (this.score === 8) {
      //console.log("normal");
      this.currentDifficulty = "normal";
      this.pipes.setVelocityX(-200);
    }

    if (this.score === 12) {
      this.currentDifficulty = "hard";
    }
  }
  getRightMostPipe() {
    let rightMostX = 0;
    this.pipes.getChildren().forEach(function (pipe) {
      rightMostX = Math.max(pipe.x, rightMostX);
    });
    return rightMostX;
  }
  saveScore() {
    const bestScoreText = localStorage.getItem("highScore");
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);

    if (!bestScore || this.score > bestScore) {
      localStorage.setItem("highScore", this.score);
      this.bestScoreText.setText(`Best score: ${this.score}`);
      this.bestScoreText.setFill("#ff0000");
    }
  }
  gameOver() {
    /* this.bird.x=this.config.startPosition.x;
        this.bird.y=this.config.startPosition.y;
        this.bird.body.velocity.y=0; */

    this.physics.pause();
    this.bird.setTint(0xff0000);
    this.texts.clear(true, true);
    /* this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
       this.input.off('pointerdown', this.flap, this); */
    this.saveScore();
    if (this.esperienzeFormazioni.length > 0) 
    this.viewCVcolide();
    this.isGameRunning = false;
    this.time.addEvent({
      delay: 5000,
      callback: () => {
        this.scene.restart();
      },
      loop: false,
    });
  }
  flap() {
    if (this.isPaused) {
      return;
    }
    this.bird.body.velocity.y = -this.flapVelocity;

    //  console.log('flap')
  }
  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
    score$.emit("update", this.score);
  }
  subscribeToScore() {
    score$.on("update", (score) => {
      //   console.log(`New Score: ${score}`);
      if (score > this.bestScore) {
        this.bestScoreText.setText(`Best score: ${score}`);
        this.bestScoreText.setFill("#ff0000");
      }
    });
  }

  destroy() {
    score$.off("update");
    super.destroy();
  }
}
export default PlayScene;