import Wave from '../shapes/wave'
import SimplexNoise from 'simplex-noise'


export default class waveController {
  constructor(ctx, options) {
    this.ctx = ctx;

    // Params
    this.width = options.width;
    this.height = options.height;
    this.maxWidth = options.maxWidth;
    this.maxWavesPointsLength = options.maxXWavesPointsLength - 1 || 29;
    this.wavesAmplitude = 400;
    this.wavesTimestamp = 0;
    this.wavesArr = [];

    // Prepare number Step X
    this.numberCoeffX = Math.floor(this.maxWidth / this.maxWavesPointsLength);
    this.numberStepX = Math.floor(this.width / this.numberCoeffX);

    // RECALC WIDTH
    let stepX = Math.floor(this.width / this.numberStepX);
    this.width = this.numberStepX * stepX;
    this.gapBetweenPoints = stepX / 2;


    // Noise
    this.simplex = new SimplexNoise();
  }

  addWave() {
    let wave = new Wave(this.ctx, {
      width: this.width,
      height: this.height,
      quantity: this.numberStepX,
      gapBetweenPoints: this.gapBetweenPoints,
      amplitude: this.wavesAmplitude,
      timestamp: this.wavesTimestamp,
      noise: this.simplex,
    });

    this.wavesArr.push(wave);
  }

  removeWave() {
    this.wavesArr = this.wavesArr.slice(1, this.wavesArr.length);
  }

  update() {
    this.wavesTimestamp += 0.005;

    if (this.wavesArr.length > 0) {
      this.wavesArr.forEach((wave) => {
        wave.update();

        if (wave.isPlayed) {
          this.removeWave();
        }
      })
    }
  }
}
