import BaseScene from './BaseScene';

class Multiplayer extends BaseScene {
    constructor(config,cv) {
      super('Multiplayer',{...config , canGoBack: true});
      this.cv = cv;
      this.textAr = [];
      this.clientInfo = [];
      this.clientMyInfo = {};
      this.room='';
      this.countdownTxt = null;
      this.buttonPlay = null;
      this.onMessage = null;
      this.onMessageListener = null;
    }
     getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
   
    create(){
        super.create();
        this.add.text(this.config.width / 2, 50, 'LOBY ', { fontSize: '60px', fill: '#516E44',fontFamily: "Bangers, system-ui" }).setOrigin(0.5);
        this.initWebSocket();
        this.playButton();
        this.createCountdownText();
        this.lobyWaiting();
    }

    initWebSocket(){
      const token = localStorage.getItem('accessToken') || this.getCookie('accessToken');
      this.webSocketService.init(token).then((clientInfo) => {
        if (clientInfo === null) {
          this.visualaStanza();
          return;
        }
       
        this.clientInfo = clientInfo;
        this.room = this.clientInfo.roomName;
        this.clientInfo.name = this.cv.nome+" "+this.cv.cognome;
        this.webSocketService.sendInfo(this.clientInfo)
        this.clientMyInfo = this.clientInfo;
       
        this.onMessageListener = (data) => {
          this.clientInfo = data;
          console.log('Received data:', data);
          this.visualaStanza();
        };
        this.webSocketService.onMessage(this.onMessageListener);
      }).catch((error) => {
        console.error('WebSocket init error:', error);
      });
    }
    createCountdownText() {
      this.countdownText = this.add.text(this.config.width / 2, this.config.height / 2, '', { fontSize: '64px', fill: '#CD00FF', fontFamily: "Bangers, system-ui" })
        .setOrigin(0.5);
    }
    playButton(){
      this.buttonPlay = this.add.text(this.config.width / 2, this.config.height - 100, 'Play ', { fontSize: '45px', fill: '#CD00FF',fontFamily: "Bangers, system-ui" }).setOrigin(0.5).setInteractive();
      this.buttonPlay.on('pointerup', () => {
        console.log(this.room);
        this.webSocketService.sendStartGame(this.room);
        this.webSocketService.lobyCountdown((data) => {
          this.buttonPlay.setText('');
          /* console.log('Received countdown data:', data); */
          this.countdownText.setText(data+" ");
          if (data === 0) {
            this.webSocketService.removeListener('infoClient', this.onMessageListener);
            this.countdownText.destroy();
            this.scene.start('PlayScene', {webSocketService: this.webSocketService, clientInfo: this.clientInfo, clientMyInfo: this.clientMyInfo});

          }
        });
        /* this.scene.start('PlayScene', {webSocketService: this.webSocketService, clientInfo: this.clientInfo}); */
      });
      this.buttonPlay.on('pointerover', () => {
        this.buttonPlay.setStyle({ fill: '#ff0' }); 
      });
    
      this.buttonPlay.on('pointerout', () => {
        this.buttonPlay.setStyle({ fill: '#CD00FF' });
      });
    }
    lobyWaiting(){
      this.webSocketService.lobyWait((data) => {
        this.buttonPlay.setText(data);
      });
    }

    visualaStanza(){
      this.textAr.forEach(textObject => textObject.destroy());
      this.textAr = [];
      const names = this.clientInfo.map(item => item.name);
      let yPosition = 100; 
      names.forEach((name,index) => {
        
      this.textAr.push(this.add.text(50, yPosition, index+1+": "+name+" ", { fontSize: '32px', fill: this.getRandomColor(),fontFamily: "Bangers, system-ui" }));
        yPosition += 40; 
      });
    }
    getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
   /* this.scene.start('PlayScene'); */
    
}
export default Multiplayer;