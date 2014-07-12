
exports.cloneSingleLevel = cloneSingleLevel;
exports.cloneAndPushArray = cloneAndPushArray;
exports.sliceArray = sliceArray;
exports.trimString = trimString;
    /*
     Clone the array/nodelist into an array, where
     the cloning is a single level deep.
     @param `ar` {array|NodeList}
     @returns {array}
     */
    function cloneSingleLevel (ar) {
        var cloned = [];
        for (var i = 0; i < ar.length; i++) {
            cloned.push(ar[i]);
        }
        return cloned;
    }

    /*
     Returns a clone of the Array `list` with
     element (type unknown) `ele` pushed onto it.
     @param `list` (Array)
     @param `ele` (Unknown)
     @return (Array)
     */
    function cloneAndPushArray(list, ele) {

        var clone = cloneSingleLevel(list);
        clone.push(ele);
        return clone;
    }
    /*
     Return a new array which is slice of
     Array `list` from start index `s`
     to end index (non-inclusive) `e`.
     @param `list` Array
     @param `s` Number
     @param `e` Number
     */
     function sliceArray (list, s, e) {
        var sliced_array = [];
        for (; s < e; s++)
            sliced_array.push(list[s]);
        return sliced_array;
    }
    /*
     Returns a left and right whitespace trimmed
     version of string `line`
     @param `line` {string}
     @returns {string}
     */

     function trimString (line) {
        //source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
        return line.replace(/^\s+|\s+$/g, '');
    }
