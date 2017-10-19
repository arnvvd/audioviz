import Point from './point';

export default class Wave {
  constructor(ctx, options) {
    this.ctx = ctx;

    // Options
    this.width = options.width;
    this.height = options.height;
    this.quantity = options.quantity || 50;
    this.amplitude = options.amplitude || 300;
    this.timestamp = options.timestamp;
    this.noise = options.noise;
    this.step = Math.PI / this.quantity;
    this.pointsArr = [];
    this.isPlayed = false;

    // Init
    this.initWave();
  }

  initWave() {
    // Loop
    for ( var i = 0; i < this.quantity; i++) {
      // New Point
      let point = new Point(this.ctx, {
        rank: i,
        angle: this.step * i,
        wavesTimestamp: this.timestamp,
        wavePointsLength: this.quantity,
        waveAmplitude: this.amplitude,
        waveWidth: this.width,
        waveHeight: this.height,
        noise: this.noise
      });
      // Push Point
      this.pointsArr.push(point)
    }
  }


  update() {
    let tweenedPoints = [];

    this.pointsArr.forEach((point) => {
      // Update
      point.update();
      // Watch if they are tweened
      if (point.isTweened) {
        tweenedPoints.push(point)
      }
    });

    // if all points are tweened
    if (tweenedPoints.length === this.quantity) {
      // Remove Wave
      this.isPlayed = true;
    }
  }
}


