
const {ccclass, property} = cc._decorator;

@ccclass
export default class Menu extends cc.Component {
    @property(cc.Label)
    controlHintLabel: cc.Label = null;
    @property({multiline: true})
    touchHint: string = "";
    @property({multiline: true})
    keyboardHint: string = "";

    onLoad () {
      let hintText = cc.sys.isMobile ? this.touchHint : this.keyboardHint;
      this.controlHintLabel.string = hintText;  
    }

    // start () {

    // }

    // update (dt) {}

    onStartGame() {
        console.log("start game ...")
        cc.director.loadScene("Game")
    }
}
