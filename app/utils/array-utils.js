const ArrayUtils = {

    average( arr ) {

        let sum = arr.reduce(function(a, b) { return a + b; });
        return sum / arr.length;

    },

    randomIntFromRange(min,max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

};

export default ArrayUtils;
