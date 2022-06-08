const ftoc = function(f_temp) {
    let res = (f_temp - 32) * 5/9;
    return Math.round(res * 10) / 10;
};

const ctof = function(c_temp) {
    let res = c_temp * 9/5 + 32;
    return Math.round(res * 10) / 10;
};

// Do not edit below this line
module.exports = {
  ftoc,
  ctof
};
