var eventBinder = require('../helper/eventBinder.js');
var findAncestorPop = require('../helper/findAncestorPop.js');
var pos = require('./pos.js');

var thePop, position_roller,position_fixed;
var diff= [];

exports.start = start;
exports.done = done;
    /*
     Event _bindIng for mousedown on drag begin.
     */
    function start(e) {


        no_user_select();

        var ancestor_pop = findAncestorPop(this);

        if (ancestor_pop) {
            eventBinder.add(document, 'mousemove', during);
            thePop = PS.pops[parseInt(ancestor_pop.getAttribute('data-pop-id'))-1];

            position_roller = thePop.scan('position_roller');
            position_fixed = thePop.scan('position_fixed') && !position_roller;


            var mp = pos.mouse(e ?
                e : window.event, position_roller ? thePop.node_roller : undefined);


            var scrolled_fix = {x: 0, y: 0};
            if (position_fixed) {
                scrolled_fix = pos.scrolled();
            }

            diff[0] = mp[0] - scrolled_fix.x - (pos.offset(ancestor_pop, thePop.node_roller).left);
            diff[1] = mp[1] - scrolled_fix.y - (pos.offset(ancestor_pop, thePop.node_roller).top);

        }

    };

    /*
     Event _bindIng for mousemove on dragging.
     */
     function during(e) {

        if (!thePop.node_box) {
            return null;
        }

        var mp = pos.mouse(e ?
            e : window.event, position_roller ? thePop.node_roller : undefined);


        var scrolled_fix = {x: 0, y: 0};
        if (position_fixed) {
            scrolled_fix = pos.scrolled();
        }


        var x = mp[0] - scrolled_fix.x - diff[0];
        var y = mp[1] - scrolled_fix.y - diff[1];
        thePop.node_box.style.left = (x) + "px";
        thePop.node_box.style.top = (y) + "px";


        // Update the pop to store the information that it has been moved
        thePop.moved = true
    };
    /*
     Event _bindIng for mouseup on drag end.
     */
     function done() {
        eventBinder.remove(document, 'mousemove', during);
        no_no_user_select();
        thePop = null;
    };

    var user_select=  {
        '-webkit-': "", '-moz-': "", '-ms-': "", '': ""
    };
    function no_user_select () {
        for (var vendor in this.user_select) {
            if (this.user_select.hasOwnProperty(vendor)) {
                this.user_select[vendor] = document.body.style[vendor + "user-select"];
                document.body.style[vendor + "user-select"] = "none";
            }
        }
    };
     function no_no_user_select() {
        for (var vendor in this.user_select) {
            if (this.user_select.hasOwnProperty(vendor) && document.body.style[vendor + "user-select"]) {
                document.body.style[vendor + "user-select"] = this.user_select[vendor];
            }
        }
    }
