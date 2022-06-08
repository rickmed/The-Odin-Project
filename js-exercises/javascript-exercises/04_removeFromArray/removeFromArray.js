const removeFromArray = function(arr, ...elems) {
    for (const elem of elems) {
        const elemIdx = arr.indexOf(elem)
        if (elemIdx === -1) continue
        arr.splice(elemIdx, 1)
    }
    return arr

};

// Do not edit below this line
module.exports = removeFromArray;
