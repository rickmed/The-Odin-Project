const sumAll = function(start, end) {

    if (start < 0 || end < 0 ||
        typeof start !== 'number' || typeof end !== 'number')
    {
        return 'ERROR'
    }

    if (start > end) {
        [start, end] = [end, start];
    }

    let res = start;
    let second_operand = start;
    while (second_operand < end) {
        second_operand++;
        res += second_operand;
    }
    return res;
};

// Do not edit below this line
module.exports = sumAll;
