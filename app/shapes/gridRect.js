import { colorManager } from '../utils/colorManager'

export default class GridRect {

  constructor(ctx, options) {
    this.ctx = ctx;
    this.position = options.position;
    this.size = options.size || 5;
    this.scale = options.scale || 1;
    this.opacity = options.opacity || 0;
    this.active = false;

    this.initOpacity = options.opacity || 0;

    if (this.position) {
      this.render();
    }
  }

  render() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.translate(this.position[0] - this.size / 2, this.position[1] - this.size / 2);
    this.ctx.scale(this.scale, this.scale);
    this.ctx.rect(0, 0, this.size, this.size);
    this.ctx.fillStyle = `rgba(${colorManager.currentColor.color[1][0]}, ${colorManager.currentColor.color[1][1]}, ${colorManager.currentColor.color[1][2]}, ${this.opacity})`;
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore();
  }

  setActive(distance, threshold) {
    this.opacity = 1;
    this.active = true
  }

  resetActive() {
    this.opacity = this.initOpacity;
  }

  update() {
    this.render();
  }
}
