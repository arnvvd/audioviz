import { colorManager } from '../utils/colorManager'
import PolygonGenerator from '../utils/polygonGenerator'


export default class MaskTriangle {

    constructor(ctx, options) {
        this.ctx = ctx;
        this.octx = options.octx;
        this.position = options.position;
        this.size = options.size || 100;
        this.borderScale = options.borderScale || 30;
        this.scale = options.scale || 1;
        this.opacity = options.opacity || 1;
        this.active = false;
        this.flag = false;
    }

    render() {


        // REPEAT FOR CLIP
        this.ctx.save();
        this.ctx.beginPath();

        let polyMask = new PolygonGenerator(3, {
           radius: this.size * this.scale,
           rotation: -1*Math.PI/2,
           position: [this.position[0], this.position[1]]
        });

        this.ctx.moveTo(polyMask.coords[0][0], polyMask.coords[0][1]);
        for(let i=0; i<polyMask.coords.length; i++){
            this.ctx.lineTo(polyMask.coords[i][0], polyMask.coords[i][1]);
        }

        this.ctx.closePath();
        this.ctx.restore();

    }


    update(audioAverage) {
        this.render();
    }
}
