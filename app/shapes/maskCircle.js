import { colorManager } from '../utils/colorManager'

export default class MaskCircle {

    constructor(ctx, options) {
        this.ctx = ctx;
        this.octx = options.octx;
        this.position = options.position;
        this.radius = options.radius || 10;
        this.borderScale = options.borderScale || 30;
        this.scale = options.scale || 1;
        this.opacity = options.opacity || 1;
        this.active = false;
        this.flag = false;


        this.initScale = options.scale || 1;
    }

    render() {

        // CTX
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(this.position[0], this.position[1]);
        this.ctx.scale(this.scale * this.borderScale, this.scale * this.borderScale);
        this.ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${colorManager.currentColor.color[0][0]}, ${colorManager.currentColor.color[0][1]}, ${colorManager.currentColor.color[0][2]}, ${this.opacity})`;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();


        // REPEAT FOR CLIP
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(this.position[0], this.position[1]);
        this.ctx.scale(this.scale, this.scale);
        this.ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.restore();


        if (!this.flag) {
            this.flag = true;
            console.log("circle");
        }

    }


    update(audioAverage) {
        if (audioAverage) {
            this.scale = 1 + 1 * audioAverage / 255;
        }
        this.render();
    }
}
