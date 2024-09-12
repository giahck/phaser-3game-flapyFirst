
import BaseScene from './BaseScene';
class PauseScene extends BaseScene {
    constructor(config) {
      super('PauseScene',config);
      this.menu=[
        {scene: 'PlayScene', text: 'Continua '},
        {scene: 'MenuScene', text: 'Exit '},
      ];
      
    }
    
    create(){
        super.create();
        this.createMenu(this.menu,this.setupMenuEvents.bind(this));
    }
    setupMenuEvents(menuItem){
        const textGameO= menuItem.textGameO;
       // console.log(textGameO);
          textGameO.setInteractive();

       textGameO.on('pointerover',()=>{
           textGameO.setStyle({fill: '#FF0'});
       });
        textGameO.on('pointerout',()=>{
            textGameO.setStyle({fill: '#CD00FF'});
        });
        textGameO.on('pointerup', () => {
            if (menuItem.scene && menuItem.text === 'Continua ') {
                // Rimuovi gli input prima di riprendere il gioco
                const playScene = this.scene.get('PlayScene');
                if (playScene) {
                    playScene.removeInputs();
                }
        
                this.scene.stop();
                this.scene.resume(menuItem.scene);
        
                // Riaggiungi gli input dopo aver ripreso il gioco
                if (playScene) {
                    playScene.handleInputs();
                }
            } else if (menuItem.text === 'Exit ') {
                this.scene.stop('PlayScene');
                this.scene.start(menuItem.scene);
            }
        });
    }
    
}
export default PauseScene;