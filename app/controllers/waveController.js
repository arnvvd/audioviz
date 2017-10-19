import Wave from '../shapes/wave'
import SimplexNoise from 'simplex-noise'


export default class waveController {
  constructor(ctx, options) {
    this.ctx = ctx;

    // Params
    this.width = options.width;
    this.height = options.height;
    this.wavesPointsLength = 20;
    this.wavesAmplitude = 300;
    this.wavesTimestamp = 0;
    this.wavesArr = [];

    // Noise
    this.simplex = new SimplexNoise();
  }

  addWave() {
    let wave = new Wave(this.ctx, {
      width: this.width,
      height: this.height,
      quantity: this.wavesPointsLength,
      amplitude: this.wavesAmplitude,
      timestamp: this.wavesTimestamp,
      noise: this.simplex,
    });

    this.wavesArr.push(wave);
  }

  removeWave() {
    this.wavesArr = this.wavesArr.slice(1, this.wavesArr.length);
    //console.log(this.wavesArr);
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
