import ArrayUtils from '../utils/array-utils'

export default class AudioManager {

    constructor(options) {

        this.audioSrc = options.audioSrc;

        // Kick
        this.kickParams = options.kickParams || {};

        // Snare
        this.snareParams = options.snareParams || {};

        // Audio Context
        window.AudioContext=window.AudioContext||window.webkitAudioContext||window.mozAudioContext;
        this.audioCtx = new AudioContext();

        // Update
        this.canUpdate = false;

        // Analyser
        this.setDefaultAnalyser();
        this.setKickAnalyser();
        this.setSnareAnalyser();

        // Load Sound
        this.loadSound();
    }



    setDefaultAnalyser() {
        this.analyser = this.audioCtx.createAnalyser();

        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    }



    setKickAnalyser() {
        this.kickAnalyser = this.audioCtx.createAnalyser();
        this.kickFilter = this.audioCtx.createBiquadFilter();

        this.kickFilter.type = "lowpass";
        this.kickFilter.frequency.value = 100;
        this.kickFilter.gain.value = 20;

        this.kickFrequencyData = new Uint8Array(this.kickAnalyser.frequencyBinCount);

    }



    setSnareAnalyser() {
        this.snareAnalyser = this.audioCtx.createAnalyser();
        this.snareFilter = this.audioCtx.createBiquadFilter();

        this.snareFilter.type = "highpass";
        this.snareFilter.frequency.value = 4000;
        this.snareFilter.gain.value = 25;

        this.snareFrequencyData = new Uint8Array(this.snareAnalyser.frequencyBinCount);
    }



    loadSound() {
        let request = new XMLHttpRequest();
        request.open('GET', this.audioSrc, true);
        request.responseType = 'arraybuffer';


        // Decode asynchronously
        request.onload = () => {

            this.audioCtx.decodeAudioData(request.response, (buffer) => {

                // success callback
                this.audioBuffer = buffer;

                // create sound from buffer
                this.audioSource = this.audioCtx.createBufferSource();
                this.audioSource.buffer = this.audioBuffer;

                // connect the audio source to context's output
                this.connectNodes();

                // play sound
                this.play();

                // set canUpdate
                this.canUpdate = true;

            }, () => {

                // error callback
                //
            });
        }

        request.send();
    }


    connectNodes() {
        // Default
        this.audioSource.connect(this.analyser);
        // Kick
        this.audioSource.connect(this.kickFilter);
        this.kickFilter.connect(this.kickAnalyser);
        // Snare
        this.audioSource.connect(this.snareFilter);
        this.snareFilter.connect(this.snareAnalyser);
        // Destination
        this.analyser.connect(this.audioCtx.destination);
    }


    play() {
        this.audioSource.start();
    }


    // connectSnareFilter() {
    //     this.snareFilter.connect(this.audioCtx.destination);
    // }
    // deconnectSnareFilterr() {
    //     this.analyser.disconnect(this.audioCtx.destination);
    // }
    // connectAnalyser() {
    //     this.analyser.connect(this.audioCtx.destination);
    // }
    // deconnectAnalyser() {
    //     this.analyser.disconnect(this.audioCtx.destination);
    // }


    getAverage(analyser, frequencyData) {
        analyser.getByteFrequencyData(frequencyData);
        return ArrayUtils.average(frequencyData);
    }

    getFrequencyValue(analyser, frequencyData, frequencyItem) {
        analyser.getByteFrequencyData(frequencyData);
        return frequencyData[frequencyItem];
    }


    update() {

        this.defaultAverage = this.getAverage(this.analyser, this.frequencyData);
        this.kickAverage = this.getFrequencyValue(this.kickAnalyser, this.kickFrequencyData, 3);
        this.snareAverage = this.getAverage(this.snareAnalyser, this.snareFrequencyData);

    }


}
