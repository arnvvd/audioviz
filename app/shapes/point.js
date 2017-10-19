export default class Point {

  constructor(ctx, options) {
    this.ctx = ctx;

    // Own Params
    this.position = [];
    this.startPosition = [];
    this.targetPosition = [];
    this.rank = options.rank;
    this.angle = options.angle;
    this.color = options.color || "blue";
    this.trigo = [];

    // Waves Params
    this.wavesTimestamp = options.wavesTimestamp;
    this.wavePointsLength = options.wavePointsLength;
    this.waveAmplitude = options.waveAmplitude;
    this.waveWidth = options.waveWidth;
    this.waveHeight = options.waveHeight;
    this.noise = options.noise;

    // Calc Position
    this.calcPosition();
    this.calcTweenPosition();

    // Tween
    this.easingDuration = options.easingDuration || 2000;
    this.currentTime = 0;
    this.now = Date.now();
    this.dt = 16;
    this.lastTime = this.now;
    this.isTweened = false;

  }

  calcPosition() {
    this.trigo = [
      Math.cos(this.angle) / 2,
      Math.sin(this.angle) / 2
    ];

    this.noisePosition = this.noise.noise3D(this.trigo[0] * 2, this.trigo[1], this.wavesTimestamp) * this.waveAmplitude;

    let step = this.waveWidth / this.wavePointsLength;
    let marginToCenter = (window.innerWidth - this.waveWidth) / 2 + step / 2;

    this.position[0] = this.waveWidth / this.wavePointsLength * this.rank + marginToCenter;
    this.position[1] = this.noisePosition * this.trigo[1] - this.waveAmplitude / 2;
  }


  calcTweenPosition() {
    // Start Position
    let sx = this.position[0];
    let sy = this.position[1];
    this.startPosition = [sx, sy];

    // Target Position
    let tx = this.position[0];
    let ty = this.waveHeight + this.waveAmplitude / 2;
    this.targetPosition = [tx, ty];
  }


  render() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.translate(this.position[0], this.position[1]);
    this.ctx.arc(0, 0, 4, 0, Math.PI * 2);
    this.ctx.strokeStyle = this.color;
    //this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore();
  }

  update() {
    this.now = Date.now();
    this.dt = this.now - this.lastTime;
    this.lastTime = this.now;

    this.currentTime += this.dt;

    if ( this.currentTime < this.easingDuration ) {
      this.position[1] = Easing['easeOutCubic']( this.currentTime, this.startPosition[1], this.targetPosition[1] - this.startPosition[1], this.easingDuration )
    } else {
      this.isTweened = true;
    }

    this.render();
  }
}
