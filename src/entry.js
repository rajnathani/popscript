var PS = require('./PS');
var eventBinder = require('./helper/eventBinder.js');

eventBinder.add(window, 'resize', PS.checkAll);
eventBinder.add(window, 'scroll', PS.checkAll);
setTimeout(PS.garbageCollector, PS.flags['garbage collection']);

window.PS = PS;

// thanks: http://stackoverflow.com/a/6829157
if (!Array.indexOf) {
    Array.prototype.indexOf = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj) {
                return i;
            }
        }
        return -1;
    }
}
