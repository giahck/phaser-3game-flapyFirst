
import BaseScene from './BaseScene';
class ScoreScene extends BaseScene {
    constructor(config,cv,score) {
      super('ScoreScene',{...config , canGoBack: true});
     this.score = score;
    }
    
    create(){
        super.create();
       const bestScore = localStorage.getItem('highScore');
       console.log(this.score);
       this.add.text(...this.screenCenter, `Best Score: ${this.score.score || 0}  `, this.fontOptions).setOrigin(0.5);
    }
   
    
}
export default ScoreScene;