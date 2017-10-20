import { colorManager } from '../utils/colorManager'

export default class GridLine {

  constructor(ctx, options) {
    this.ctx = ctx;
    this.position = options.position;
    this.width = options.width;
    this.height = options.height;
    this.scale = options.scale || 1;
    this.opacity = options.opacity || 0;
    this.rotation = options.rotation || 0;
    this.velocity = 1;
    this.active = false;

    this.initRotation = options.rotation || 0;

    if (this.position) {
      this.render();
    }
  }

  render() {

    let startPoint = {
      x: this.position[0],
      y: this.position[1] - this.height / 2
    };
    let endPoint = {
      x: startPoint.x,
      y: startPoint.y + this.height
    };

    // rotate around center - find mid-point using lerp
    let midPoint = {
      x: startPoint.x + (endPoint.x - startPoint.x) * 0.5,
      y: startPoint.y + (endPoint.y - startPoint.y) * 0.5
    };

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.translate(midPoint.x, midPoint.y);
    this.ctx.rotate(this.rotation);
    this.ctx.translate(-midPoint.x, -midPoint.y);
    this.ctx.scale(this.scale, this.scale);
    this.ctx.moveTo(startPoint.x, startPoint.y);
    this.ctx.lineTo(endPoint.x, endPoint.y);
    this.ctx.lineWidth = this.width;
    this.ctx.strokeStyle = `rgba(${colorManager.currentColor.color[1][0]}, ${colorManager.currentColor.color[1][1]}, ${colorManager.currentColor.color[1][2]}, ${this.opacity})`;
    this.ctx.stroke();
    this.ctx.restore();
  }

  setActive(distance, threshold) {
    this.velocity = 1.5;
    this.opacity = 1;
    this.rotation = this.rotation + 1;
    this.active = true
  }

  resetActive() {
    this.velocity = 1;
    this.opacity = .5;
    this.rotation = this.initRotation;
  }

  update() {
    this.rotation += 0.01 * this.velocity;
    this.initRotation += 0.01 * this.velocity;
    this.render();
  }
}
