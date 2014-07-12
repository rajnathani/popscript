var Pop = require('./Pop.js');

var eventBinder = require('./helper/eventBinder.js');
var cssClass = require('./helper/cssClass.js');
var createCSSSelector = require('./helper/createCSSSelector.js');
var eventPopOut = require('./helper/eventPopOut.js');

var compiler = require('./compiler/compiler.js');




// Create a Singleton
module.exports = {
    version: "2.0",
    flags:{
        'alert error on error': false,  // alerts the error (alert)
        'throw error on error': true,   // throws the error (throw)
        'Z': 1000,                      // base z-index for all pops,
        'garbage collection': 16000     // interval for garbage collection
    },


    pops:[],
    compiled: {},

    compile:function(to_compile) {
            compiler.compile(this.compiled,to_compile)
    },









    // advanced API
    /*
     Returns the number of pops currently in existence
     @return (Number)
     */
    total: function () {
        return cssClass.nodes('popscript-box').length;
    },


    checkAll: function () {
        for(var i=0; i < PS.pops.length;i++) {
          PS.pops[i].check();
        }
    },


    garbageCollector : function() {
      for (var i=0, curPop; i < PS.pops.length; i++) {
        curPop = PS.pops[i];
        if (curPop.destroyed) {
          delete PS.pops[i];
        }
      }
    },
    /*
     Creates a pop based on the pop class mentioned
     in the string `pop_classes` with the content of
     `content` with an optional `inline_popscript`
     */
    pop: function (pop_classes,content,inline_popscript) {

        // Instantiate a new pop with the given pop_input
        var thePop = new Pop(pop_classes, content,inline_popscript);
        PS.pops.push(thePop);
        thePop._setPopId(PS.pops.length);

        // Return the pop
        // for tracking purposes
        return thePop;

    },




};




/*
 Initiates PopScript in the browser environment.
 */
    eventBinder.add(document, 'keydown', eventPopOut.esc);
    eventBinder.add(document, 'click', eventPopOut.blur);
    eventBinder.add(document, 'contextmenu', eventPopOut.blur);


    createCSSSelector('.popscript-display-none', 'display:none');
    createCSSSelector('.popscript-drag', 'cursor:move')
