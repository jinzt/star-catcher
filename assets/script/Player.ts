
const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    // 主角跳跃高度
    @property
    jumpHeight: number = 0;
    // 主角跳跃时间
    @property
    jumpDuration: number = 0;
    // 辅助形变动作时间
    @property
    squashDuration: number = 0;
    // 最大移动速度
    @property
    maxMoveSpeed: number = 0;
    // 加速度
    @property
    accel: number = 0;
    // 跳跃音效资源
    @property({type:cc.AudioClip})
    jumpAudio: cc.AudioClip = null;

    // 加速度方向开关
    accLeft: boolean = false;
    accRight: boolean = false;

    // 主角当前水平方向速度
    xSpeed: number = 0;
    minPosX = 0;
    maxPosX = 0;

    // 初始化跳跃动作
    jumpAction: cc.Action = null;

    onLoad () {
        this.jumpAction  = this.setJompAction();
        this.node.runAction(this.jumpAction);

        this.setInputControl()
    }

    start () {



    }

    update (dt) {
        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;   
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }

        // 限制主角的速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 根据当前速度更新主角的位置
        this.node.x += this.xSpeed * dt;

        // 限制主角移动范围
        if (this.node.x > this.node.parent.width/2) {
            this.node.x = this.node.parent.width/2;
            this.xSpeed = 0;
        } else if (this.node.x < -this.node.parent.width/2){
            this.node.x = -this.node.parent.width/2;
            this.xSpeed = 0;
        }
    }


    setInputControl() {
        // 添加键盘事件监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)

        // 触摸监听
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
    }


    private setJompAction() {
        // 跳跃上升
        let jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        let jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // 形变
        let squash = cc.scaleTo(this.squashDuration, 1, 0.6);
        let strtch = cc.scaleTo(this.squashDuration, 1, 1.2);
        let scaleBack = cc.scaleTo(this.squashDuration, 1, 1);
        // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
        let callback = cc.callFunc(this.playJumpSound, this);
        // 不断重复
        return cc.repeatForever(cc.sequence(squash, strtch, jumpUp, scaleBack, jumpDown, callback));
    }

    onKeyDown(event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.accLeft = true;
                this.accRight = false;
                break; 
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.accLeft = false;
                this.accRight = true;
                break; 
        }
    }

    onKeyUp(event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.a:
                this.accLeft = false;
                break; 
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.accRight = false;
                break; 
        }
    }

    onTouchBegan(event) {
        let touchLoction = event.getLocation();
        if (touchLoction.x >= cc.winSize.width / 2) {
            this.accLeft = false;
            this.accRight = true;
        } else {
            this.accLeft = true;
            this.accRight = false;
        }
    }

    onTouchEnded(event) {
        this.accLeft = false;
        this.accRight = false;
    }

    playJumpSound(){
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    }

}
