import {vec2} from 'gl-matrix';
import MaskCircle from '../shapes/maskCircle';
import MaskTriangle from "../shapes/maskTriangle";
import MaskParallelogram from "../shapes/maskParallelogram";

export default class maskController {

    constructor(ctx, options) {
        this.ctx = ctx;

        this.width = options.width;
        this.height = options.height;
        this.maxWidth = options.maxWidth;
        this.maxHeight = options.maxHeight;


        // Masks
        this.masks = [];


        // Mask Circle
        this.maskCircle = {
            type: 'circle',
            isActive: false,
            instance: null
        };


        // Mask Triangle
        this.maskTriangle = {
            type: 'triangle',
            isActive: false,
            instance: null
        };


        // Mask Parallelogram
        this.maskParallelogram = {
            type: 'parallelogram',
            isActive: false,
            instance: null
        };


        // Execute
        this.prepareMasks();
        this.setNewCurrentMask();
    }




    prepareMasks() {

        this.setCircleMask();
        this.setTriangleMask();
        this.setTriangleMask();
        this.setParallelogramMask();

    }



    setCircleMask() {

        this.maskCircle.instance = new MaskCircle(this.ctx, {
            position: vec2.fromValues(this.width / 2, this.height / 2),
            radius: 100,
            opacity: 1
        });


        this.masks.push(this.maskCircle);
    }



    setTriangleMask() {

        this.maskTriangle.instance = new MaskTriangle(this.ctx, {
            position: vec2.fromValues(this.width / 2, this.height / 2),
            size: 100,
            opacity: 1
        });


        this.masks.push(this.maskTriangle);
    }


    setParallelogramMask() {

        this.maskParallelogram.instance = new MaskParallelogram(this.ctx, {
            position: vec2.fromValues(this.width / 2, this.height / 2),
            size: 300,
            opacity: 1
        });


        this.masks.push(this.maskParallelogram);
    }



    setNewCurrentMask() {

        console.log(this.masks);

        let nextMasks = this.masks.filter((mask) => {
            return mask.isActive !== true;
        });

        let currentMask = nextMasks[Math.floor(Math.random() * nextMasks.length)];

        // Remove isActive
        this.masks.forEach((mask) => {
            mask.isActive = false;
        });

        currentMask.isActive = true;

        this.currentMask = currentMask;
    }




    update() {

        this.currentMask.instance.update();

    }
}
