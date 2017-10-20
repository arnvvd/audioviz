import debounce from "./utils/debounce";
import Stats from 'stats.js';
import { colorManager } from './utils/colorManager';



/* IMPORT CLASSES */
import AudioController from './controllers/audioController'
import WaveController from './controllers/waveController'
import GridController from './controllers/gridController'
import MaskController from './controllers/maskController'
import OffscreenCanvasScene from './offscreenCanvas/offscreenCanvasScene'
import Background from './shapes/background'



export default class App {

    constructor() {
        // Size
        this.elementsMediaQuery = 1340;
        this.elementsMaxWidth = 1120;
        this.elementsMaxHeight = 620;
        this.calcElementsSizes();

        // Update
        this.updateActive = true;
        this.DELTA_TIME = 0;
        this.LAST_TIME = Date.now();

        // Stats
        this.stats = new Stats();
        this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this.stats.dom );

        this.initCanvas();
        this.initOffsetCanvas();
        this.initAudio();
        this.render();
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
        this.setCanvasSize(this.canvas);
    }


    /**
     * Offset canvas
     */
    initOffsetCanvas() {
        // Create Canvas
        this.oCanvas = document.createElement('canvas');
        // Set context
        this.octx = this.oCanvas.getContext('2d');
        // Set Size
        this.setCanvasSize(this.oCanvas);
    }


    setCanvasSize(canvas) {
        // Set Size
        canvas.width = this.width;
        canvas.height = this.height;
    }


    /**
     * Render
     */
    render() {
        this.initBackground();
        this.initGrid();
        this.initWaves();
        this.initMask();
        this.initOffscreenCanvasScene();
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
                averageThresold: 95,
                timeThresold: 100,
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
            height: this.height,
        });
    }


    /**
     * initWaves
     */
    initWaves() {
        this.waveController = new WaveController(this.ctx, {
            width: this.elWidth,
            height: this.elHeight,
            maxWidth: this.elementsMaxWidth,
            maxXWavesPointsLength: 30
        });
    }


    /**
     * initGrid
     */
    initGrid() {
        this.gridController = new GridController(this.ctx, {
            width: this.elWidth,
            height: this.elHeight,
            maxWidth: this.elementsMaxWidth,
            maxHeight: this.elementsMaxHeight,
            maxXNumberByRange: 30,
            maxYNumberByRange: 12
        });
    }


    /**
     * initMask
     */
    initMask() {
        this.maskController = new MaskController(this.ctx, {
            octx: this.octx,
            oCanvas: this.oCanvas,
            width: this.canvas.width,
            height: this.canvas.height,
            maxWidth: this.elementsMaxWidth,
            maxHeight: this.elementsMaxHeight
        });
    }


    /**
     * initOffscreenCanvasScene
     */

    initOffscreenCanvasScene() {
        // Init offscreenCanvas
        this.offscreenCanvasScene = new OffscreenCanvasScene(this.octx, {
            width: this.width,
            height: this.height,
            elWidth: this.elWidth
        });
    }




    /**
     * Calc Elements Size
     */
    calcElementsSizes() {
        // Width / Height
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Elements Waves + Grid
        if (this.width > this.elementsMediaQuery) {
            this.elWidth = this.elementsMaxWidth;
            this.elHeight = this.elementsMaxHeight;
        } else {
            this.elWidth = this.width * .8;
            this.elHeight = this.height * .8;
        }
    }


    /**
     * bindEvents
     */
    bindEvents() {
        /* Resize function with debounce*/
        window.addEventListener('resize', debounce( () => {
            this.onResize()
        }, 100));
    }


    /**
     * Start RAF
     */
    startRAF() {
        // Update
        if(this.updateActive) {
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
        this.stats.begin();
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
                  let dir = !this.offscreenCanvasScene.direction;
                  this.offscreenCanvasScene.playLines(dir);
              }
            );

            // On Snare
            this.getAudioEvent(
              this.audioManager.snareAverage,
              this.audioManager.snareParams,
              () => {
                  colorManager.changeCurrentColor();
                  this.maskController.setNewCurrentMask();
                  this.gridController.setNewCurrentPattern();
                  let dir = !this.offscreenCanvasScene.direction;
                  this.offscreenCanvasScene.playLines(dir);
              }
            );

        }


        // BACKGROUND
        this.background.update();

        // WAVE CONTROLLER
        this.waveController.update();

        // GRID CONTROLLER
        this.gridController.update();

        // MASK CONTROLLER
        this.maskController.update(this.audioManager.defaultAverage);

        // MASK ANIMATION
        this.offscreenCanvasScene.update();

        this.stats.end();

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
        // SIZE
        this.calcElementsSizes();
        this.setCanvasSize(this.canvas);
        this.setCanvasSize(this.oCanvas);
        // RENDER
        this.render();
    }
}
