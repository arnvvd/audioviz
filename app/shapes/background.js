import { colorManager } from "../utils/colorManager"

export default class Background {
  constructor(ctx, options) {
    this.ctx = ctx;

    this.position = options.position;
    this.width = options.width;
    this.height = options.height;

    this.render();
  }

  render() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.translate(this.position[0], this.position[1]);
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fillStyle = `rgb(${colorManager.currentColor.color[0][0]}, ${colorManager.currentColor.color[0][1]}, ${colorManager.currentColor.color[0][2]})`;
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore();
  }

  update() {
    this.render();
  }
}

