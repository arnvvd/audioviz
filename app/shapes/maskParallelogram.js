import { colorManager } from '../utils/colorManager'

export default class MaskParallelogram {

    constructor(ctx, options) {
        this.ctx = ctx;
        this.octx = options.octx;
        this.position = options.position;
        this.width = options.size || 100;
        this.height = options.size || 50;
        this.borderScale = options.borderScale || 30;
        this.scale = options.scale || 1;
        this.opacity = options.opacity || 1;
        this.active = false;
        this.flag = false;

        this.initScale = options.scale || 1;
    }

    render() {

        let scaleTranslateValueX = (this.width * this.scale - this.width) / 2;
        let scaleTranslateValueY = (this.height * this.scale - this.height) / 2;
        let borderScaleTranslateValueX = (this.width * this.scale * this.borderScale - this.width) / 2;
        let borderScaleTranslateValueY = (this.height * this.scale * this.borderScale - this.height) / 2;


        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(this.position[0] - this.width / 2 - borderScaleTranslateValueX, this.position[1] - this.height / 2 - borderScaleTranslateValueY);
        this.ctx.rotate(this.angle);
        this.ctx.scale(this.scale * this.borderScale, this.scale * this.borderScale);
        this.ctx.rect(0, 0, this.width, this.height);
        this.ctx.fillStyle = `rgba(${colorManager.currentColor.color[0][0]}, ${colorManager.currentColor.color[0][1]}, ${colorManager.currentColor.color[0][2]}, ${this.opacity})`;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();


        // REPEAT FOR CLIP
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(this.position[0] - this.width / 2 - scaleTranslateValueX, this.position[1] - this.height / 2 - scaleTranslateValueY);
        this.ctx.rotate(this.angle);
        this.ctx.scale(this.scale, this.scale);
        this.ctx.moveTo( -this.size, this.size );
        this.ctx.rect(0, 0, this.width, this.height);
        //this.ctx.fillStyle = `rgba(${colorManager.currentColor.color[0][0]}, ${colorManager.currentColor.color[0][1]}, ${colorManager.currentColor.color[0][2]}, ${this.opacity})`;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();


        if (!this.flag) {
            this.flag = true;
            console.log("para");
        }


    }


    update(audioAverage) {

        if (audioAverage) {
            this.scale = 1 + 1 * audioAverage / 255;
        }

        this.render();
    }
}
