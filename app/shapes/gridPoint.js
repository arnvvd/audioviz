import { colorManager } from '../utils/colorManager'

export default class GridPoints {

  constructor(ctx, options) {
    this.ctx = ctx;
    this.position = options.position;
    this.radius = options.radius || 0;
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
    this.ctx.fillStyle =`rgba(${colorManager.currentColor.color[1][0]}, ${colorManager.currentColor.color[1][1]}, ${colorManager.currentColor.color[1][2]}, ${this.opacity})`;
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore();
  }

  linkPoints(pointPositionToLink) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.position[0], this.position[1]);
    this.ctx.lineTo(pointPositionToLink[0], pointPositionToLink[1]);
    this.ctx.strokeStyle =`rgba(${colorManager.currentColor.color[1][0]}, ${colorManager.currentColor.color[1][1]}, ${colorManager.currentColor.color[1][2]}, ${this.opacity})`;
    this.ctx.stroke();
  }

  setActive(distance, threshold, wavePointPosition) {
    this.linkPoints(wavePointPosition);
    this.active = true
  }

  resetActive() {
    this.scale = this.initScale;
  }

  update() {
    this.render();
  }
}
