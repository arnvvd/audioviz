import Dat from 'dat-gui';
import NumberUtils from './utils/number-utils';
import {vec2} from 'gl-matrix';
import { colorManager } from './utils/colorManager';

/* IMPORT CLASSES */
import AudioController from './controllers/audioController'
import WaveController from './controllers/waveController'
import GridController from './controllers/gridController'
import Background from './shapes/background'

export default class App {

    constructor() {
        // Width / Height
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Update
        this.updateActive = true;
        this.DELTA_TIME = 0;
        this.LAST_TIME = Date.now();

        this.initCanvas();
        this.initAudio();
        this.initBackground();
        this.initGrid();
        this.initWaves();
        this.bindEvents();
        this.startRAF();
    }


    /**
     * initCanvas()
     */
    initCanvas() {
        // Root
        let root = document.body.querySelector('.app');
        // Create Canvas
        this.canvas = document.createElement('canvas');
        root.appendChild(this.canvas);
        // Set context
        this.ctx = this.canvas.getContext('2d');
        // Set Size
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }


    /**
     * initAudio
     */
    initAudio() {
        this.audioManager = new AudioController({
            audioSrc: '../sound/drive-me-crazy.mp3',
            kickParams: {
                timestamp: 0,
                averageThresold: 252,
                timeThresold: 250,
                isPlaying: false
            },
            snareParams: {
                timestamp: 0,
                averageThresold: 98,
                timeThresold: 250,
                isPlaying: false
            }
        })
    }


  /**
   * initBackground
   */
  initBackground() {
      this.background = new Background(this.ctx, {
          position: [0, 0],
          width: this.width,
          height: this.height
      });
  }

    /**
     * initWaves
     */
    initWaves() {
        this.waveController = new WaveController(this.ctx, {
            width: this.width * .8,
            height: this.height * .8
        });
    }

    /**
     * initGrid
     */
    initGrid() {
        this.gridController = new GridController(this.ctx, {
            width: this.width * .8,
            height: this.height * .8
        });
    }


    /**
     * bindEvents
     */
    bindEvents() {
        window.addEventListener('resize', this.onResize.bind(this) );
    }


    /**
     * Render
     */
    render() {

    }

  /**
   * Start RAF
   */
  startRAF() {
        // Update
        if(this.updateActive) {
            // Render
            this.render();
            // Do Update
            this.update();
        } else {
            // Cancel RAF
            cancelAnimationFrame(this.raf);
        }
    }

    /**
     * update
     */
    update() {
        // CLEAR CANVAS
        this.ctx.clearRect(0,0, this.width, this.height);

        // CALC DELTA_TIME
        this.DELTA_TIME = Date.now() - this.LAST_TIME;
        this.LAST_TIME = Date.now();


        // AUDIO MANAGER
        if (this.audioManager.canUpdate) {

            // Update
            this.audioManager.update();

            // On Kick
            this.getAudioEvent(
              this.audioManager.kickAverage,
              this.audioManager.kickParams,
              () => {
                  this.waveController.addWave();
                  this.gridController.wavesArr = this.waveController.wavesArr;
              }
            );

            // On Snare
            this.getAudioEvent(
              this.audioManager.snareAverage,
              this.audioManager.snareParams,
              () => {
                  colorManager.changeCurrentColor();
                  this.gridController.setNewCurrentPattern();
              }
            );

        }


        // BACKGROUND
        this.background.update();

        // WAVE CONTROLLER
        this.waveController.update();

        // GRID CONTROLLER
        this.gridController.update();

        // RAF
        this.raf = requestAnimationFrame(this.update.bind(this));
    }



    getAudioEvent(average, params, callback) {

        if (average > params.averageThresold){

            if (params.isPlaying) {
                params.timestamp += this.DELTA_TIME;

                if(params.timestamp > params.timeThresold) {
                    params.timestamp = 0;
                    params.isPlaying = false;
                }
            }

            if (!params.isPlaying) {
                callback();
                params.isPlaying = true;
            }
        }

    }



    /**
     * onResize
     */
    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
}
