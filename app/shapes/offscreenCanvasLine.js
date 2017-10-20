import ArrayUtils from '../utils/array-utils'
import { colorManager } from '../utils/colorManager'


export default class OffscreenCanvasLine {

    constructor(octx, options) {
        this.octx = octx;
        this.width = options.width;
        this.height = options.height;
        this.x = options.x;
        this.y = options.y;
        this.lineWidth = options.lineWidth;
        this.radians = Math.random() * Math.PI * 2;
        this.velocity = 0.05;
        this.randomR = ArrayUtils.randomIntFromRange(20, this.height);
        this.rayon = {
            x: this.randomR,
            y: this.randomR
        };
        this.lastPosition = {x: this.x, y: this.y};
    }


    render(lastPoint) {
        this.octx.beginPath();
        this.octx.moveTo(lastPoint.x, lastPoint.y);
        this.octx.lineTo(this.x, this.y);
        this.octx.lineWidth = this.lineWidth;
        this.octx.strokeStyle = `rgba(${colorManager.currentColor.color[0][0]}, ${colorManager.currentColor.color[0][1]}, ${colorManager.currentColor.color[0][2]}, 1)`;
        this.octx.stroke();
        this.octx.closePath();
    }


    update(newPosition) {
        const lastPoint = {x: this.x, y: this.y};

        // Move points over time
        this.radians += this.velocity;

        // Drag effect
        this.lastPosition.x += (newPosition.x - this.lastPosition.x) * 0.08;
        this.x = this.lastPosition.x;
        this.y = this.lastPosition.y + Math.sin(this.radians) * this.rayon.y;


        this.render(lastPoint);
    }

}