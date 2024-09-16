import BaseScene from './BaseScene';

const clientInfo = {

};
class Multiplayer extends BaseScene {
    constructor(config,cv) {
      super('Multiplayer',{...config , canGoBack: true});
      this.cv = cv;
    }
     getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
   
    create(){
        super.create();
        this.initWebSocket();
       
       
    }

    initWebSocket(){
      const token = localStorage.getItem('accessToken') || this.getCookie('accessToken');
      this.webSocketService.init(token).then((clientInfo) => {
        if (clientInfo === null) {
          this.visualaStanza();
          return;
        }
        this.clientInfo = clientInfo;
        this.clientInfo.name = this.cv.nome;
        this.webSocketService.sendInfo(this.clientInfo)
        this.webSocketService.onMessage((data) => {
          this.clientInfo = data;
          this.visualaStanza();
        });
      }).catch((error) => {
        console.error('WebSocket init error:', error);
      });
    }
    visualaStanza(){
      const names = this.clientInfo.map(item => item.name);
      let yPosition = 50; // Posizione iniziale per il testo
      names.forEach(name => {
        this.add.text(50, yPosition, name, { fontSize: '32px', fill: '#fff' });
        yPosition += 40; // Incrementa la posizione Y per il prossimo nome
      });
    }

   /* this.scene.start('PlayScene'); */
    
}
export default Multiplayer;