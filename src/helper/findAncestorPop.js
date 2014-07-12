var cssClass = require('./cssClass.js');

/*
 * Returns the ancestor of the DOM node element `n`
 * which contains it (node `n`), it can also be
 * node `n` itself.
 * @param {Node} `n`
 */
module.exports =  function (n) {
    var cur_node = n;
    while (cur_node) {
        if (cssClass.has(cur_node, 'popscript-box')) {
            return cur_node;
        }
        cur_node = cur_node.parentNode;
    }
    return null;
};
