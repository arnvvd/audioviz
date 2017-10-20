import OffscreenCanvasLine from './offscreenCanvasLine'
import { colorManager } from '../utils/colorManager'


export default class OffscreenCanvasScene {

    constructor(octx, options){

        this.octx = octx;
        this.width = options.width;
        this.elWidth = options.elWidth;
        this.height = options.height;
        this.particleNumber = options.particleNumber;
        this.newLinesPosition = {
            x: (this.width - this.elWidth) / 2,
            y: 0
        };
        this.lines = [];
        this.direction = false;

        this.initLines();
    }


    initLines() {
        for (let i = 0; i < this.particleNumber; i++) {
            const radius = (Math.random() * 2) + 1;
            this.lines.push(
                new OffscreenCanvasLine(this.octx, {
                    width: this.width,
                    height: this.height,
                    x: 0,
                    y: 0,
                    lineWidth: radius

                })
            );
        }
    }


    playLines(dir) {

        this.direction = dir;

        if (this.direction === true) {
            console.log("right");
            this.newLinesPosition = {
                x: this.width - (this.width - this.elWidth * 2) / 2,
                y: 0
            }
        } else {
            console.log("left");
            this.newLinesPosition = {
                x: (this.width - this.elWidth * 2) / 2,
                y: 0
            }
        }

    }


    update() {
        this.octx.fillStyle = `rgba(${colorManager.currentColor.color[1][0]}, ${colorManager.currentColor.color[1][1]}, ${colorManager.currentColor.color[1][2]}, 0.5)`;
        this.octx.fillRect(0, 0, this.width, this.height);
        this.lines.forEach(line => {
            line.update(this.newLinesPosition);
        });
    }
}
