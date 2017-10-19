import {vec2} from 'gl-matrix';
import GridParticle from '../shapes/gridParticle';
import GridLine from '../shapes/gridLine';


export default class gridController {
  constructor(ctx, options) {
    this.ctx = ctx;

    // Grid
    this.width = options.width;
    this.height = options.height;
    this.numberByRange = options.numberByRange || 30;
    this.positions = [];
    this.wavesArr = [];
    this.distanceThresold = 30;

    // Patterns
    this.patterns = [];

    this.particlePattern = {
      type: 'particle',
      isActive: false,
      data: []
    };

    this.linePattern = {
      type: 'line',
      isActive: false,
      data: []
    };

    // Execute
    this.setGrid();
    this.drawGrid();
    this.setNewCurrentPattern();
  }

  setGrid() {
    let step = this.width / this.numberByRange;

    for(let x = 0; x < this.width; x += step ){
      for(let y = 0; y < this.height; y += step ){
        let positionObj = {
          x: x + (window.innerWidth - this.width) / 2 + step / 2,
          y: y +(window.innerHeight - this.height) / 2  + step / 4
        };
        this.positions.push( positionObj )
      }
    }
  }

  drawGrid() {
    this.positions.forEach((position) => {
      this.setParticlePattern(position);
      this.setLinePattern(position);
    });

    this.patterns.push(this.particlePattern);
    this.patterns.push(this.linePattern);
  }

  setParticlePattern(position) {
    let particle = new GridParticle(this.ctx, {
      position: vec2.fromValues(position.x, position.y),
      radius: 4,
      opacity: 0.3
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
          if (distance < this.distanceThresold) {
            el.setActive(distance, this.distanceThresold);
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
