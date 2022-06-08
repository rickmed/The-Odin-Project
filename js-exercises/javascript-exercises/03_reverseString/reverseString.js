const reverseString = function(str) {
    let new_str = '';
    for (let i = str.length - 1; i > -1; --i) {
        new_str = new_str.concat(str[i])
    }
    return new_str

};

// Do not edit below this line
module.exports = reverseString;
