class PolygonGenerator {
    constructor(side, options) {
        this.relativeCoords = [];
        this.coords = [];
        this.side = side;
        this.rotation = options.rotation || 0;
        this.radius = options.radius || 50;
        this.position = options.position || [0, 0];
        this.genCoords();
    }

    genCoords(){
        var step = Math.PI*2 / this.side;
        var angle;
        this.relativeCoords = [];
        this.coords = [];
        for(var i=0; i< this.side; i++) {
            angle = i*step + this.rotation;
            this.relativeCoords.push({
                x: Math.cos(angle) * this.radius,
                y: Math.sin(angle) * this.radius
            });
            this.coords.push([this.relativeCoords[i].x + this.position[0], this.relativeCoords[i].y + this.position[1]]);
        }
    }


}

export default PolygonGenerator;