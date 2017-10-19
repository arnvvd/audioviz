export default class Particle {

    constructor(ctx, options) {
        this.ctx = ctx;
        this.position = options.position;
        this.originPosition = [options.position[0], options.position[1]];
        this.radius = options.radius || 10;
        this.scale = options.scale || 1;
        this.color = options.color || 'blue';

        // Update
        this.angle = options.angle || 0;
        this.amplitude = 100;

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
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }


    calcPosition() {
        this.trigo = [
            Math.sin(this.angle),
            Math.cos(this.angle)
        ];
        this.position[0] = this.originPosition[0] + this.trigo[0] * this.amplitude;
        //this.position[1] = this.originPosition[1] + this.trigo[1] + this.amplitude;
    }


    update() {
        this.calcPosition();
        this.render();
    }
}
