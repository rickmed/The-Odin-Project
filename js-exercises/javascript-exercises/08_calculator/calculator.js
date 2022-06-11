const add = function(x, y) {
    return x + y;
};

const subtract = function(x, y) {
    return x - y
};

const sum = function(arr) {
    return arr.reduce( (x, acum) => {
        return x + acum;
    }, 0)
};

const multiply = function(numbers) {
    return numbers.reduce( (x, acum) => x * acum, 1)
};

const power = function(base, exp) {
    return base ** exp
};

const factorial = function(n) {
    if (n === 0 ) return 1
    return factorial(n - 1) * n
};

// Do not edit below this line
module.exports = {
  add,
  subtract,
  sum,
  multiply,
  power,
  factorial
};
