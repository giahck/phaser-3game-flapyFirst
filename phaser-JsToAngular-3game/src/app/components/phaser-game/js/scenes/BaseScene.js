import Phaser from 'phaser';
class BaseScene extends Phaser.Scene {
    constructor(key,config) {
      super(key);
      this.config = config;
      this.screenCenter = [config.width / 2, config.height / 2];
      this.fontSize = 40;
      this.lineHeight = 42;
      this.fontOptions = {fontSize: `${this.fontSize}px`, fill: '#CD00FF', fontFamily: "Bangers, system-ui"};
    }
    
    create(){
        this.add.image(0,0, 'sky').setOrigin(0);

        if(this.config.canGoBack){
            this.createBackButton();
        }
       
    }
    createBackButton(){
        const backBtn = this.add.image(this.config.width - 10, this.config.height - 10, 'back')
        .setInteractive()
        .setOrigin(1)
        .setScale(2)
        .setScrollFactor(0);
        
        backBtn.on('pointerup', () => {
            this.scene.start('MenuScene');
        })
    }
   
    createMenu(menu, setupMenuEvents) {
        let lastMenuPositionY = -50;
    
        menu.forEach(menuItem => {
          const menuPosition = [this.screenCenter[0], this.screenCenter[1] + lastMenuPositionY];
         menuItem.textGameO= this.add.text(...menuPosition, menuItem.text, this.fontOptions).setOrigin(0.5, 1);
          lastMenuPositionY += this.lineHeight;
          setupMenuEvents(menuItem);
        })
        
      }
    
}
export default BaseScene;