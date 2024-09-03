
import BaseScene from './BaseScene';
class MenuScene extends BaseScene {
    constructor(config,cv) {
      super('MenuScene',config);
      this.menu=[
        {scene: 'PlayScene', text: 'Play'},
        {scene: 'ScoreScene', text: 'Score'},
        {scene: null, text: 'Exit'},
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
           textGameO.setStyle({fill: '#FF0'});
       });
        textGameO.on('pointerout',()=>{
            textGameO.setStyle({fill: '#CD00FF'});
        });
        textGameO.on('pointerup',()=>{
            menuItem.scene && this.scene.start(menuItem.scene);
            if(menuItem.text === 'Exit'){
                this.game.destroy(true);
            }
        });
    }
    
}
export default MenuScene;