const ArrayUtils = {

    average( arr ) {

        let sum = arr.reduce(function(a, b) { return a + b; });
        return sum / arr.length;

    }

};

export default ArrayUtils;
