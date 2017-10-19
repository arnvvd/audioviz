export default class Particle {

    constructor(ctx, options) {
        this.ctx = ctx;
        this.position = options.position;
        this.originPosition = [options.position[0], options.position[1]];
        this.radius = options.radius || 10;
        this.scale = options.scale || 1;
        this.color = options.color || 'blue';
        this.opacity = 0.5;
        this.active = false;
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
        this.ctx.fillStyle = "rgba(255, 0, 0," + this.opacity + ")";
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }

    updateFromDistance(distance, threshold) {
        this.opacity = 1 - distance / threshold;
    }

    update() {
        this.render();
    }
}
