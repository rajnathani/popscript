var findAncestorPop = require('./findAncestorPop.js');

exports.esc = function(e) {
     e = e || window.event;
     if (!findAncestorPop(e.srcElement || e.target)) {
         var keycode = e ? e.keyCode : (window.event).keyCode;
         if (keycode === 27) {
             var thePop = highestConditionPop(function (curPop) {
                 return curPop && curPop.isConstructed() && !curPop.isHidden() && curPop.scan('esc');
             });
             if (thePop) {
                 thePop.out();
             }
         }
     }
 };
exports.blur = function(e){
   e = e || window.event;
   if (!findAncestorPop(e.srcElement || e.target)) {
       var thePop = highestConditionPop(function (curPop) {
           return curPop && curPop.isConstructed() && !curPop.isHidden() && curPop.scan('blur');
       });
       if (thePop) {

           thePop.out();
       }
   }
 };

/*
 Returns the highest pop which satisfies the
 function `condition`. If condition is unspecified then
 return the highest pop without any condition.
 Returns undefined if no pops exist
 @param `condition` {function}: condition which satisfies the highest pop
 @return {Pop} highest pop with condition satisfied
 */
function highestConditionPop (condition) {
     if (!condition) {
        condition = function () {
            return true
        }
    }
    for (var i=PS.pops.length-1, curPop; i >= 0 ; i--) {
      curPop = PS.pops[i];
      if (curPop && !curPop.hidden && condition(curPop)) {
          return curPop;
      }
    }
};
