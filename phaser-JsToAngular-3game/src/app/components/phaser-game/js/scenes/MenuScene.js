
import BaseScene from './BaseScene';
class MenuScene extends BaseScene {
    constructor(config,cv) {
      super('MenuScene',config);
      this.menu=[
        {scene: 'PlayScene', text: 'Play '},
        {scene: 'ScoreScene', text: 'Score '},
        {scene: 'Multiplayer', text: 'Multiplayer 2vs2 '},
        {scene: null, text: 'Exit '},
      ];
      
    }
    
    create(){
        super.create();
        this.createMenu(this.menu,this.setupMenuEvents.bind(this));
    }
    setupMenuEvents(menuItem){
        const textGameO= menuItem.textGameO;
     //   console.log(textGameO);
          textGameO.setInteractive();

       textGameO.on('pointerover',()=>{
           textGameO.setStyle({fill: '#FF0',fontFamily: "Bangers, system-ui"});
       });
        textGameO.on('pointerout',()=>{
            textGameO.setStyle({fill: '#CD00FF',fontFamily: "Bangers, system-ui"});
        });
        textGameO.on('pointerup',()=>{
            menuItem.scene && this.scene.start(menuItem.scene);
            if(menuItem.text === 'Exit '){
                this.game.destroy(true);
            }
        });
    }
    
}
export default MenuScene;