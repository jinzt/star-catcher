
const {ccclass, property} = cc._decorator;

@ccclass
export default class Over extends cc.Component {
    @property(cc.Label)
    curScoreLabel: cc.Label = null;
    @property(cc.Label)
    maxScoreLabel: cc.Label = null;

    // onLoad () {
    // }

    start () {
        let curScore = cc.sys.localStorage.getItem("CurScore")
        let maxScore = cc.sys.localStorage.getItem("MaxScore")
        if (maxScore == null) {
            maxScore = 0;
        }
        curScore = Number(curScore)
        maxScore = Number(maxScore)
        
        if (curScore > maxScore) {
            maxScore = curScore;
            cc.sys.localStorage.setItem("MaxScore", curScore);
        }
        this.curScoreLabel.string = "Score: " + curScore;
        this.maxScoreLabel.string = "MaxScore: " + maxScore;
        console.log("game over curscore:" + curScore + " maxscore:" + maxScore)
    }

    // update (dt) {}

    onResStartGame() {
        console.log("restart game ...")
        cc.director.loadScene("Game")
    }
}
