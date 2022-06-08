const repeatString = function(string, num) {
    if (num < 0) return 'ERROR'
    let new_str = '';
    for (let i = 0; i < num; i++) {
        new_str = new_str.concat(string)
    };
    return new_str;
};

// Do not edit below this line
module.exports = repeatString;
