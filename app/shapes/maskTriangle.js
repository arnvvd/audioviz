import { colorManager } from '../utils/colorManager'

export default class MaskTriangle {

    constructor(ctx, options) {
        this.ctx = ctx;
        this.position = options.position;
        this.size = options.size || 100;
        this.scale = options.scale || 1;
        this.opacity = options.opacity || 1;
        this.active = false;

        this.initScale = options.scale || 1;

        if (this.position) {
            this.render();
        }
    }

    render() {

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(this.position[0], this.position[1]);
        this.ctx.rotate(this.angle);
        this.ctx.moveTo( -this.size, this.size );
        this.ctx.lineTo( 0, -this.size );
        this.ctx.lineTo( this.size, this.size );
        this.ctx.lineTo( -this.size, this.size );
        //this.ctx.fillStyle = `rgba(${colorManager.currentColor.color[0][0]}, ${colorManager.currentColor.color[0][1]}, ${colorManager.currentColor.color[0][2]}, ${this.opacity})`;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }


    update() {
        this.render();
    }
}
