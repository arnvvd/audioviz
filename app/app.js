import Dat from 'dat-gui';
import NumberUtils from './utils/number-utils';
import {vec2} from 'gl-matrix';

/* IMPORT AUDIO MANAGER */
import AudioManager from './utils/audioManager'

/* IMPORT SHAPES */
import Particule from './shapes/particule'

const COLORS = ['red', 'blue', 'green', '#2d335b', '#535b2d', '#494949', '#d7d7d7', '#9ad4ce'];

export default class App {

    constructor() {
        // Width / Height
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Update
        this.updateActive = true;
        this.DELTA_TIME = 0;
        this.LAST_TIME = Date.now();

        this.initAudio();
        this.initCanvas();
        this.bindEvents();
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
     * initAudio
     */
    initAudio() {
        this.audioManager = new AudioManager({
            audioSrc: '../sound/drive-me-crazy.mp3',
            kickParams: {
                timestamp: 0,
                averageThresold: 254,
                timeThresold: 250,
                isPlaying: false
            },
            snareParams: {
                timestamp: 0,
                averageThresold: 98,
                timeThresold: 110,
                isPlaying: false
            }
        })
    }


    /**
     * bindEvents
     */
    bindEvents() {
        window.addEventListener( 'resize', this.onResize.bind(this) );
    }


    /**
     * Render
     */
    render() {
        this.particle = new Particule (this.ctx, {
            position: vec2.fromValues(this.width / 2, this.height / 2),
            radius: 100,
            amplitude: 100
        });
    }


    /**
     * update
     */
    update() {
        // Clear Canvas
        this.ctx.clearRect(0,0, this.width, this.height);

        // Calc DELTA_TIME
        this.DELTA_TIME = Date.now() - this.LAST_TIME;
        this.LAST_TIME = Date.now();

        // Audio Manager
        if (this.audioManager.canUpdate) {

            // Update
            this.audioManager.update();


            // On Kick
            this.getAudioEvent(
                this.audioManager.kickAverage,
                this.audioManager.kickParams,
                () => {
                    this.particle.color = COLORS[Math.floor(Math.random() * COLORS.length)];
                    console.log('kick');
                }
            );

            // On Snare
            this.getAudioEvent(
                this.audioManager.snareAverage,
                this.audioManager.snareParams,
                () => {
                    console.log('snare');
                }
            );

        }


        // Update Position
        this.particle.update();
        // Do Render
        this.particle.render();

        // Do RAF
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
