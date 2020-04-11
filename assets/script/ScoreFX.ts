
import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScoreFX extends cc.Component {

    @property(cc.Animation)
    anim: cc.Animation = null;

    game: Game = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start () {

    // }

    // update (dt) {}

    init(game : Game) {
        this.game = game;
    }


    // 播放动画
    play() {
        // console.log("----play anim")
        this.anim.play("score_fx")
    }

    hitFx(){
        // console.log("----hitFx")
        this.game.despawnScoreFX(this.node)
    }
}
