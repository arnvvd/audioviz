import {vec2} from 'gl-matrix';
import GridParticle from '../shapes/gridParticle';
import GridLine from '../shapes/gridLine';
import GridRect from '../shapes/gridRect';
import GridPoint from '../shapes/gridPoint';


export default class gridController {
  constructor(ctx, options) {
    this.ctx = ctx;

    // Grid
    this.width = options.width;
    this.height = options.height;
    this.maxWidth = options.maxWidth;
    this.maxHeight = options.maxHeight;
    this.maxNumberByRangeX = options.maxXNumberByRange - 1 || 29;
    this.maxNumberByRangeY = options.maxYNumberByRange - 1 || 11;
    this.positions = [];
    this.wavesArr = [];

    // Prepare number Step X
    this.numberCoeffX = Math.floor(this.maxWidth / this.maxNumberByRangeX);
    this.numberStepX = Math.floor(this.width/this.numberCoeffX);

    // Prepare number Step Y
    this.numberCoeffY = Math.floor(this.maxHeight / this.maxNumberByRangeY);
    this.numberStepY = Math.floor(this.height / this.numberCoeffY);

    // Patterns
    this.patterns = [];

    this.particlePattern = {
      type: 'particle',
      isActive: false,
      distanceThreshold: 30,
      data: []
    };

    this.linePattern = {
      type: 'line',
      isActive: false,
      distanceThreshold: 30,
      data: []
    };

    this.rectPattern = {
      type: 'rect',
      isActive: false,
      distanceThreshold: 30,
      data: []
    };

    this.pointPattern = {
      type: 'point',
      isActive: false,
      distanceThreshold: 60,
      data: []
    };

    // Execute
    this.setGrid();
    this.drawGrid();
    this.setNewCurrentPattern();
  }

  setGrid() {

    // Loop by Step
    let stepX = Math.floor(this.width / this.numberStepX);
    let stepY = Math.floor(this.height / this.numberStepY);

    console.log(this.numberStepX);
    for(let x = 0; x < this.width; x += stepX ){
      for(let y = 0; y < this.height; y += stepY ){
        let positionObj = {
          x: x + (window.innerWidth - (this.numberStepX * stepX)) / 2,
          y: y + (window.innerHeight - (this.numberStepY * stepY)) / 2
        };
        this.positions.push( positionObj )
      }
    }
  }

  drawGrid() {
    this.positions.forEach((position) => {
      this.setParticlePattern(position);
      this.setLinePattern(position);
      this.setRectPattern(position);
      this.setPointPattern(position);
    });

    this.patterns.push(this.particlePattern);
    this.patterns.push(this.linePattern);
    this.patterns.push(this.rectPattern);
    this.patterns.push(this.pointPattern);
  }

  setParticlePattern(position) {
    let particle = new GridParticle(this.ctx, {
      position: vec2.fromValues(position.x, position.y),
      radius: 4,
      opacity: 1
    });
    // Push
    this.particlePattern.data.push(particle);
  }

  setLinePattern(position) {
    let line = new GridLine(this.ctx, {
      position: vec2.fromValues(position.x, position.y),
      width: 2,
      height: 20,
      opacity: 1,
      rotation: Math.PI / 4
    });
    // Push
    this.linePattern.data.push(line);
  }

  setRectPattern(position) {
    let rect = new GridRect(this.ctx, {
      position: vec2.fromValues(position.x, position.y),
      size: 8,
      opacity: 0.4
    });
    // Push
    this.rectPattern.data.push(rect);
  }

  setPointPattern(position) {
    let point = new GridPoint(this.ctx, {
      position: vec2.fromValues(position.x, position.y),
      radius: 1,
      opacity: 1
    });
    // Push
    this.pointPattern.data.push(point);
  }

  setNewCurrentPattern() {

    let nextPatterns = this.patterns.filter((pattern) => {
      return pattern.isActive != true;
    });

    let currentPattern = nextPatterns[Math.floor(Math.random() * nextPatterns.length)];

    // Remove isActive
    this.patterns.forEach((pattern) => {
      pattern.isActive = false;
    });

    currentPattern.isActive = true;

    this.currentPattern = currentPattern;
  }


  calcDistanceWithWavesPoints(el) {

    for (let i = 0; i < this.wavesArr.length; i++) {
      for (let j = 0; j < this.wavesArr[i].pointsArr.length; j++){

        let point = this.wavesArr[i].pointsArr[j];
        let distance = Math.sqrt(Math.pow(point.position[0] - el.position[0], 2) + Math.pow(point.position[1] - el.position[1] , 2));

        if(el.active === false) {
          if (distance < this.currentPattern.distanceThreshold) {
            el.setActive(distance, this.currentPattern.distanceThreshold, point.position);
          } else {
            el.resetActive();
          }
        }
      }
    }
  }



  update() {

    for (let i = 0; i < this.currentPattern.data.length; i++) {
      this.currentPattern.data[i].active = false;

      this.calcDistanceWithWavesPoints(this.currentPattern.data[i]);

      // Affect with distance
      this.currentPattern.data[i].update();
    }
  }
}
