import Player from "./Player";
import Star from "./Star";

const {ccclass, property} = cc._decorator;



@ccclass
export default class Game extends cc.Component {
    // 地面节点，用于确定星星生成的高度,玩家初始位置
    @property(cc.Node)
    ground: cc.Node = null;

    // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
    @property(cc.Node)
    player: cc.Node = null;

    // 这个属性引用了星星预制资源
    @property(cc.Prefab)
    starPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    scoreFXPrefab: cc.Prefab = null;
    @property(cc.Label)
    scoreLable: cc.Label = null;


    @property({type:cc.AudioClip})
    scoreAudio: cc.AudioClip = null;
    @property({type:cc.AudioClip})
    jumpAudio: cc.AudioClip = null;

    isPlaying: boolean = true;

    // 星星产生后消失时间的随机范围
    @property
    maxStarDuration:number = 0;
    @property
    minStartDuration: number = 0;

    score: number = 0;
    groundY: number = 0;

    timer: number = 0;
    starDuration: number = 0;

    starPool:cc.NodePool = null;
    scorePool: cc.NodePool = null;

    onLoad () {
        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        // 创建节点池
        this.starPool = new cc.NodePool("Star");
        this.scorePool = new cc.NodePool("ScoreFX");

        // 初始化计分
        this.score = 0;

        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;

        // 设置主角y坐标
        this.player.y = this.groundY

        // 生成一个新的星星
        this.spawnNewStar();
    }

    start () {
        cc.sys.localStorage.setItem("CurScore", 0)
    }

    update (dt) {
        if (!this.isPlaying) {
            return;
        }
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    }

    // 生成一个星星
    spawnNewStar() {
        // 使用给定的模板在场景中生成一个新节点
        let newStar: cc.Node = null;
        if (this.starPool.size() > 0){
            newStar = this.starPool.get();
        }else {
            newStar = cc.instantiate(this.starPrefab);
        }
        // 在星星组件上暂存 Game 对象的引用
        newStar.getComponent(Star).init(this);

        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStartDuration + Math.random() * (this.maxStarDuration - this.minStartDuration);
        this.timer = 0;
        console.log("spawn a star")
    }

    despawnStar(star){
        this.node.removeChild(star);
        this.starPool.put(star);
        console.log("despawn a star")
    }


    // 计算星星的位置
    getNewStarPosition() {
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        let randX = (Math.random() - 0.5) * 2 * (this.node.width/2);
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        let randY = this.groundY + Math.random() * this.player.getComponent("Player").jumpHeight + 50;
        return cc.v2(randX, randY)
    }

    // 赠送分数
    gainScore(position) {
        this.score += 1;
        // 更新显示的文字
        this.scoreLable.string = "Score: " + this.score;
        // 播放动画
        let socreFx = this.spawnScoreFX(); 
        socreFx.init(this);
        this.node.addChild(socreFx.node);
        socreFx.node.setPosition(position);
        socreFx.play()
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
        console.log("gain score:"+1+ "curscore:" + this.score);
    }

    // 游戏结束
    gameOver() {
        this.isPlaying = false;
        this.player.stopAllActions()
        cc.sys.localStorage.setItem("CurScore", this.score)
        cc.director.loadScene("Over")
    }


    // 生成金币特效
    spawnScoreFX(){
        if (this.scorePool.size() > 0){
            return this.scorePool.get().getComponent("ScoreFX");
        }else {
            return cc.instantiate(this.scoreFXPrefab).getComponent("ScoreFX");
        }
    }

    // 释放金币特效
    despawnScoreFX(scoreFX){
        this.scorePool.put(scoreFX);
        this.node.removeChild(scoreFX);
    }
}
