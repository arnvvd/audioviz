import { colorManager } from '../utils/colorManager'

export default class GridParticle {

    constructor(ctx, options) {
        this.ctx = ctx;
        this.position = options.position;
        this.radius = options.radius || 10;
        this.scale = options.scale || 1;
        this.opacity = options.opacity || 0;
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
        this.ctx.scale(this.scale, this.scale);
        this.ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${colorManager.currentColor.color[1][0]}, ${colorManager.currentColor.color[1][1]}, ${colorManager.currentColor.color[1][2]}, ${this.opacity})`;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }

    setActive(distance, threshold) {
        let value = 1 - distance / threshold;
        this.scale = 1 + value * 3;
        this.active = true
    }

    resetActive() {
        this.scale = this.initScale;
    }

    update() {
        this.render();
    }
}
