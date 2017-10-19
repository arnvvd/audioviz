import {vec2} from 'gl-matrix';
import Particle from '../shapes/particle';

const COLORS = ['red', 'blue', 'green', '#2d335b', '#535b2d', '#494949', '#d7d7d7', '#9ad4ce'];

export default class gridController {
  constructor(ctx, options) {
    this.ctx = ctx;

    // Grid
    this.canvasWidth = options.canvasWidth;
    this.canvasHeight = options.canvasHeight;
    this.numberByRange = options.numberByRange || 20;
    this.positions = [];
    this.currentColor = "blue";

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
    let step = this.canvasWidth / this.numberByRange;
    for(let x = 0; x < this.canvasWidth; x += step ){
      for(let y = 0; y < this.canvasHeight; y += step ){
        let positionObj = {
          x: x,
          y: y
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
    let particle = new Particle(this.ctx, {
      position: vec2.fromValues(position.x, position.y),
      radius: 10,
      amplitude: 100
    });
    // Push
    this.particlePattern.data.push(particle);
  }

  setLinePattern(position) {
    let line = new Particle(this.ctx, {
      position: vec2.fromValues(position.x, position.y),
      radius: 3,
      amplitude: 100
    });
    // Push
    this.linePattern.data.push(line);
  }

  setNewCurrentPattern() {

    // A RANGER
    this.currentColor = COLORS[Math.floor(Math.random() * COLORS.length)];

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

  update() {
    this.currentPattern.data.forEach((el) => {
      el.color = this.currentColor;
      el.update();
    })
  }
}
