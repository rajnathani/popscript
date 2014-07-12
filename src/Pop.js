var psError = require('./psError.js');
var defaults = require('./defaults.js');

var eventBinder = require('./helper/eventBinder.js');
var cssClass = require('./helper/cssClass.js');
var createCSSSelector = require('./helper/createCSSSelector.js');
var eventPopOut = require('./helper/eventPopOut.js');
var other = require('./helper/other.js');


var compiler = require('./compiler/compiler.js');
var convert = require('./compiler/convert.js');

var drag = require('./interface/drag.js');
var coverFix = require('./interface/coverFix.js');
var addAnimation = require('./interface/addAnimation.js');
var pos = require('./interface/pos.js');
var dims = require('./interface/dims.js');

module.exports = Pop;

function Pop(pop_classes,content, inline_popscript) {

    this.orig_content = content;
    this.pop_classes = pop_classes;
    this.inline_popscript = inline_popscript;

    this.changeClass(pop_classes);
    inline_popscript && this.changeProperties(inline_popscript);


    this._fnLocalBindInExecuted = this._fnBindInExecuted.bind(this);
    this._fnLocalBindOutExecuted = this._fnBindOutExecuted.bind(this);

    this.out = this.out.bind(this);
    this.destroy = this.destroy.bind(this);
    this.hide = this.hide.bind(this);


    this._initiate();

    this.binder = this.scan('binder');
    if (this.binder){
      this.node_binder = this.binder[0];
      this.in_events = this.binder[1] instanceof Array ? this.binder[1] : [this.binder[1]];
      this.out_events = !this.binder[2] ? this.in_events: (this.binder[2] instanceof Array ? this.binder[2] : [this.binder[2]]);
      this._bindIn();
    } else {
      this._construct();
    }
}
Pop.prototype._setPopId = function(pop_id) {
  this.pop_id = pop_id;
  this.node_box.setAttribute('data-pop-id', pop_id);
}

/*
 * Changes the pop class
 * and compiles.
 */
Pop.prototype.changeClass = function (pop_classes, transition_duration) {
    this.pop_classes = pop_classes;
    this.pop_class_list = checkValidPopClasses(this.pop_classes);
    this._compileClasses();

    this.constructed && this._changeTransition(transition_duration);
};

/*
 * Adds inline popscript, and combines it along with
 * the existing compilation.
 */
Pop.prototype.changeProperties = function (inline_popscript, transition_duration) {

        compiler.compilePopClass(inline_popscript, this.compiled);
        // Update the extra popscript with the newly arrived extra popscript
        for (var k in inline_popscript) {
            if (inline_popscript.hasOwnProperty(k)) {
                this.inline_popscript[k] = inline_popscript[k];
            }
        }
        this.constructed && this._changeTransition(transition_duration);

};




/*
 * Return true pop is constructed
 * false otherwise
 */
Pop.prototype.isConstructed =  function () {
    return this.constructed;
};
/*
 * Return true pop is hidden,
 * false otherwise
 */
Pop.prototype.isHidden =  function () {
    return this.hidden;
};
/*
* Return true is the pop contains the given pop class,
* false otherwise.
*/
Pop.prototype.hasClass= function ( class_name) {
    return this.pop_classes.split(/ +/).indexOf(class_name) !== -1;
};


Pop.prototype._changeTransition= function (transition_duration) {
    var transition = typeof transition_duration === 'number';   // Transition is off if given a value of 0
    if (transition) {
        this.node_box.style.animation = "";
        this.node_box.style.webkitAnimation = "";
        this.node_cover.style.animation = "";
        this.node_cover.style.webkitAnimation = "";

        var box_orig_transition_normal = this.node_box.style.transition;
        var box_orig_transition_webkit = this.node_box.style.webkitTransition;

        var cover_orig_transition_normal = this.node_cover.style.transition;
        var cover_orig_transition_webkit = this.node_cover.style.webkitTransition;

        this.node_box.style.transition = transition_duration + 'ms all';
        this.node_box.style.webkitTransition = transition_duration + 'ms all';
        this.node_cover.style.transition = transition_duration + 'ms all';
        this.node_cover.style.webkitTransition = transition_duration + 'ms all';
        var self = this;
        setTimeout(function () {
            self.node_box.style.transition = box_orig_transition_normal;
            self.node_box.style.webkitTransition = box_orig_transition_webkit;
            self.node_cover.style.transition = cover_orig_transition_normal;
            self.node_cover.style.webkitTransition = cover_orig_transition_webkit;
        }, transition_duration + 70);
    }

    this._construct( true,transition)
};


    Pop.prototype._animateIn= function () {
        var animation_in_duration = this.scan('animation_in_duration');
        if (this.scan('cover')) {
            var cover_animation_in = this.scan('animation_in_cover');
            if (cover_animation_in)
                addAnimation(this.node_cover, cover_animation_in, animation_in_duration);
        }
        var box_animation_in = this.scan('animation_in_box');
        if (box_animation_in)
            addAnimation(this.node_box, box_animation_in, animation_in_duration);

    };


    Pop.prototype._animateOut = function () {
      var animation_out_duration = this.scan('animation_out_duration');
      if (this.scan('cover')) {
          var cover_animation_out = this.scan('animation_out_cover');
          if (cover_animation_out)
              addAnimation(this.node_cover, cover_animation_out, animation_out_duration,this.scan('out'));
      }
      var box_animation_out = this.scan('animation_out_box');
      addAnimation(this.node_box, box_animation_out, animation_out_duration, this.scan('out'));

    };



/*
 Sets the compiled value of property `prop`
 to the value `val`. It converts the `val` to
 its compiled form given the type of property
 `prop` is.
 `prop` may me given as an array of n-1 scopes
 and the last item being the sub property. In this
 case it convert the scope chain to a string property name
 in order to set the property. (eg: ['ANIMATION', 'IN', 'box] -> 'animation_in_box')
 @param `prop` (String/Array)
 @param `val` (any type)
 */
Pop.prototype.changeProperty = function (prop, val, transition_duration) {
    var scope_chain = prop instanceof Array ? other.sliceArray(prop, 0, prop.length - 1) : [];
    prop = prop instanceof Array ? prop[prop.length - 1] : prop;
    compiler.registerPopProperty(this.compiled, prop, val, scope_chain);
    this.constructed && this._changeTransition(transition_duration);
};


/*
 Compiles and returns the Pop with the pop classes (given in order) in the
 array `this.pop_class_list`.
 @returns {object} compiled pop
 */
Pop.prototype._compileClasses = function () {
    this.compiled = {}; //obliterate the present compilation
    var cur_attrs, cur_attr;
    // Iterate 1 extra time if there is any extra popscript
    for (var i = 0; i < this.pop_class_list.length; i++) {
        cur_attrs = PS.compiled[this.pop_class_list[i]];
        for (cur_attr in cur_attrs) {
            if (cur_attrs.hasOwnProperty(cur_attr)) {
                this.compiled[cur_attr] = cur_attrs[cur_attr];
            }
        }
    }

};


/*
 Returns the value of the PopScript
 property `prop`.
 @param `prop` (String)
 @returns (Any Type)
 */
Pop.prototype.scan = function (prop) {
    prop = prop.toLowerCase();
    if (this.compiled[prop] === undefined)
        return defaults[prop];
    return this.compiled[prop];
};


    /*
     * Set the pop's blur property to false, and
     * then return it to its original value after 500ms.
     * This is done in order to prevent clicking of an external
     * node to deploy the pop to cause the blur property of the po
     * to dispatch it immediately.
     */
    Pop.prototype._noBlur = function (duration) {
        var self = this;
        var orig_blur = this.scan('blur');
        this.compiled.blur = false;
        setTimeout(function () {
          self.compiled.blur = orig_blur;
        }, duration);
    },


Pop.prototype._initiate = function(){


        this.node_box = document.createElement('div');
        this.node_box.className= 'popscript-display-none';
        this.node_box.style.right = "auto";
        this.node_box.style.bottom = "auto";

        document.body.appendChild(this.node_box);

        this.node_cross = document.createElement('span');
        this.node_cross.className= 'popscript-display-none';


        // Initiation of this.node_cover
        this.node_cover = dims.cover();
        this.node_cover.className = 'popscript-display-none';
        document.body.appendChild(this.node_cover);

        // Initiation of this.node_roller
        this.node_roller = dims.cover();
        this.node_roller.className= 'popscript-display-none';
        document.body.appendChild(this.node_roller);


};

Pop.prototype.changeContent = function (content, transition_duration) {
  this.content = typeof content === 'function' ? content(this) : content;
  this.constructed && this._changeTransition(transition_duration);
}
Pop.prototype._construct = function(transition,transition_duration) {
    var self = this;

    !this.content && this.changeContent(this.orig_content);
    if (['string', 'number'].indexOf(typeof this.content) !== -1) {
        this.node_box.innerHTML = this.content;
    } else {
        this.node_box.appendChild(this.content);
    }
    if (this.scan('beforePopIn') && this.scan('beforePopIn')(this,!this.constructed) === false) {
                return false;
    }
    this.node_box.cssText = '';
    this.node_cover.cssText = '';
    this.node_roller.cssText = '';
    this.node_cross.cssText = '';


    if (!transition){
        this._animateIn();
    }

    if (this.scan('cover')) {
        this.node_cover.className = 'popscript-cover ' + this.scan('style_class_cover');
        if (this.scan('style_inline_cover'))
            this.node_cover.style.cssText += this.scan('style_inline_cover');

        this.node_cover.style.zIndex = this.scan('position_z')();
        cssClass.remove(this.node_cover, 'popscript-display-none');
    } else {
        cssClass.add(this.node_cover, 'popscript-display-none');
    }

    // Cross
    this.node_cross.innerHTML = "";
    if (this.scan('cross')) {
        this.node_cross.className = 'popscript-cross popscript-out ' + this.scan('style_class_cross');
        if (this.scan('style_inline_cross'))
            this.node_cross.style.cssText += this.scan('style_inline_cross');

        this.node_cross.appendChild(document.createTextNode(this.scan('cross_content')));
        this.node_cross.style.display = 'inline';
        this.node_box.appendChild(this.node_cross);
    } else {
        cssClass.add(this.node_cross, 'popscript-display-none');
    }

    // Box
    cssClass.remove(this.node_box, 'popscript-display-none');
    this.node_box.className = 'popscript-box ' + this.scan('style_class_box');
    this.node_box.style.zIndex = this.scan('position_z')();

    if (this.scan('style_inline_box'))
        this.node_box.style.cssText += this.scan('style_inline_box');

    // Clean up the drag events directly associated with the box node.
    // (Done due to popscript property conflicts with previous pop classes)
    cssClass.remove(this.node_box, 'popscript-drag');
    eventBinder.remove(this.node_box, 'mousedown', drag.start);
    eventBinder.remove(this.node_box, 'mouseup', drag.done);

    if (this.scan('full_draggable'))
        cssClass.add(this.node_box, 'popscript-drag');

    // Clean up the hide/destroy events directly associated with the box node.
    // (Done due to popscript property conflicts with previous pop classes)
    cssClass.remove(this.node_box, 'popscript-destroy');
    cssClass.remove(this.node_box, 'popscript-hide');
    eventBinder.remove(this.node_box, 'click', this.destroy);
    eventBinder.remove(this.node_box, 'click', this.hide);

    if (this.scan('click_me_out'))
        cssClass.add(this.node_box, 'popscript-' + this.scan('out'));

    this.node_box.parentNode.removeChild(this.node_box);
    if (this.scan('position_roller')) {
        this.node_roller.className = 'popscript-roller';
        this.node_roller.style.zIndex = this.scan('position_z')();
        this.node_roller.innerHTML = '';
        this.node_roller.appendChild(this.node_box);
        coverFix.fix();
        cssClass.remove(this.node_roller, 'popscript-display-none');
    } else {
        cssClass.add(this.node_roller, 'popscript-display-none');
        document.body.appendChild(this.node_box);
    }


    // Check if the user has added any popscript-drag elements to the pop.
    var all_move = cssClass.nodes('popscript-drag', this.node_box);
    for (i = 0; i < all_move.length; i++) {
        eventBinder.add(all_move[i], 'mousedown', drag.start);
        eventBinder.add(all_move[i], 'mouseup', drag.done);
    }

    // Check if the user has added any popscript-destroy elements to the pop.
    var all_destroy = cssClass.nodes('popscript-destroy', this.node_box);
    for (i = 0; i < all_destroy.length; i++) {
        eventBinder.add(all_destroy[i], 'click', self.destroy);
    }

    // Check if the user has added any popscript-out elements to the pop.
    var all_out = cssClass.nodes('popscript-out', this.node_box);
    for (i = 0; i < all_out.length; i++) {
        eventBinder.add(all_out[i], 'click', self.out);
    }


    // Check if the user has added any popscript-hide elements to the pop.
    var all_hide = cssClass.nodes('popscript-hide', this.node_box);
    for (i = 0; i < all_hide.length; i++) {
        eventBinder.add(all_hide[i], 'click', self.hide);
    }

    var prev_timeouts = this.timeouts;
    if (prev_timeouts) {
        for (var i = 0; i < prev_timeouts.length; i++) {
            clearTimeout(prev_timeouts[i]);
        }
    }
    var prev_intervals = this.intervals;
    if (prev_intervals) {
        for (var i = 0; i < prev_intervals.length; i++) {
            clearTimeout(prev_intervals[i]);
        }
    }

    var align_checks = this.scan('position_check');

    this.timeouts = [];
    this.intervals = [];

    if (align_checks) {
        var timeouts = align_checks[0];
        for (var i = 0; i < timeouts.length; i++) {
            this.timeouts.push(setTimeout(function () {
                self.check()
            }, timeouts[i]));
        }
        var intervals = align_checks[1];
        for (i = 0; i < intervals.length; i++) {
            this.intervals.push(setInterval(function () {
                self.check()
            }, intervals[i]));
        }
    }

    if (this.scan('destroy')) {
        setTimeout(self.out, this.scan('destroy'))
    }

    this.constructed = true;
    this._noBlur(200);
    this.check();
};

Pop.prototype.check = function (first_time) {
    if (!first_time) {
        dim = dims.node(this.node_box, true);
    } else {
        dim = dims.node(arg2.cloneNode(true));
    }
    if (!dim) return;

    if (this.moved || this.hidden) return false;

    var window_dim = dims.win();
    var scrolled = pos.scrolled();

    if (this.scan('cover')) {
        this.node_cover.style.height = dims.docHeight() + "px";
    }
    if (this.scan('position_roller')) {
        this.node_roller.style.height = dims.docHeight() + "px";
        this.node_roller.style.maxHeight = dims.win().height + "px";
        this.node_roller.style.top = scrolled.y + "px";
        this.node_roller.style.left = scrolled.x + "px";
    }

    // pop_y/x components
    // (0) value (number)
    // (1) left/top position or right/bottom
    // (2) percent based (boolean)

    var pop_y, pop_x, position_fixed, cover, final_scroll_x, final_scroll_y;

    cover = this.scan('cover');
    position_roller = this.scan('position_roller');

    if (this.scan('nearelement')) {
        var ele, cb;
        ele = this.scan('nearelement')[0];
        cb = this.scan('nearelement')[1];
        var pop_xy = nearElement(ele, cb, dim);
        this.compiled.position_fixed = pos.isFixed(ele);
        pop_x = convert.boxPosition.call(['position_x_scrolled', this.compiled], pop_xy[0]);
        pop_y = convert.boxPosition.call(['position_y_scrolled', this.compiled], pop_xy[1]);
    } else {
        pop_x = this.scan('position_x');
        pop_y = this.scan('position_y');
    }

    position_fixed = this.scan('position_fixed');

    this.node_box.style.position = (!position_roller && position_fixed) ? 'fixed' : 'absolute';

    // if its one of the following:
    // (1) fixed pop
    // [deleted] (2) roller pop (this req has been officially removed)
    // then do not take scrolled into account
    // since scrolled can be taken into account only once store the current value of scrolled
    // so as to provide the value for the repositioning

    this.scrolled_y = this.scrolled_y !== undefined ? this.scrolled_y : (!position_roller && this.scan('position_y_scrolled') ? scrolled.y : 0);
    this.scrolled_x = this.scrolled_x !== undefined ? this.scrolled_x : (!position_roller && this.scan('position_x_scrolled') ? scrolled.x : 0);

    final_scroll_y = this.scrolled_y + (!position_roller && this.scan('position_y_scroll') ? scrolled.y : 0);
    final_scroll_x = this.scrolled_x + (!position_roller && this.scan('position_x_scroll') ? scrolled.x : 0);


    // Reset the positions
    this.node_box.style.top = "auto";
    this.node_box.style.left = "auto";

    var left_offset = window_dim.width - dim.w + final_scroll_x;
    var top_offset = window_dim.height - dim.h + final_scroll_y;

    var computed_top,computed_left;


    if (pop_x[0] !== 'auto') {
        // check if its a (left)/top position pop
        if (pop_x[1]) {
            computed_left = dims.auto(pop_x[0], window_dim.width, dim.w, final_scroll_x, pop_x[2]) + "px";
        } else {
            computed_left = (left_offset - dims.auto(pop_x[0], window_dim.width, dim.w, -final_scroll_x, pop_x[2])) + "px";
        }

    } else {
        computed_left = dims.auto(pop_x[0], window_dim.width, dim.w, final_scroll_x, pop_x[2]) + "px";
    }

    if (pop_y[0] !== 'auto') {
        // check if its a left/(top) position pop
        if (pop_y[1]) {
            computed_top = dims.auto(pop_y[0], window_dim.height, dim.h, final_scroll_y, pop_y[2]) + "px";
        } else {
            computed_top = (top_offset - dims.auto(pop_y[0], window_dim.height, dim.h, -final_scroll_y, pop_y[2])) + "px";
        }
    } else {
        computed_top = dims.auto(pop_y[0], window_dim.height, dim.h, final_scroll_y, pop_y[2]) + "px";
    }



    this.node_box.style.left = computed_left;
    this.node_box.style.top = computed_top;

    if (this.scan('position_roller')) {
      this.node_box.style.marginBottom = computed_top;
    }

};




Pop.prototype._fnBindInExecuted = function() {
    this.bound_out = false;
    for (var i=0,in_event; i <this.in_events.length;i++) {
      in_event = this.in_events[i];
      eventBinder.remove(this.node_binder,in_event,this._fnLocalBindInExecuted);
    }
    if (!this.constructed) {
      this._construct();
    } else {
      this.show();
    }
    this._bindOut();
};
Pop.prototype._bindIn = function() {

  for (var i=0,in_event; i < this.in_events.length;i++) {
      in_event = this.in_events[i];
      eventBinder.add(this.node_binder, in_event, this._fnLocalBindInExecuted);
  }
};
Pop.prototype._fnBindOutExecuted = function() {
    this.bound_out = true;
    for (var i=0,out_event; i < this.out_events.length;i++) {
        out_event = this.out_events[i];
        eventBinder.remove(this.node_binder,out_event,this._fnLocalBindOutExecuted);
    }
    if (this.scan('out') === 'destroy') {
        PS.pop(this.pop_classes,this.orig_content,this.inline_popscript)
    } else {
        this._bindIn();
    }
    this.out();
};

Pop.prototype._bindOut = function() {
  for (var i=0,out_event; i < this.out_events.length;i++) {
      out_event = this.out_events[i];
      eventBinder.add(this.node_binder, out_event, this._fnLocalBindOutExecuted);
  }
};



Pop.prototype.out = function(out_type) {

    var self =this;
    if (this.hidden) return;
    if (this.destroyed)
        return;
    else if (this.scan('out') === 'destroy')
        this.destroyed =  true;

    // The default out type is that of 'destroy'
    out_type = (typeof out_type === 'string') ? out_type : this.scan('out');
    // The value must either be 'hide' or 'destroy'
    out_type = convert.hideOrDestroy(out_type);
    if (!out_type) return;


    if (this.scan('beforePopOut') && this.scan('beforePopOut').call(out_type) === false) {
        return false;
    }


    if (!this.node_cover)
        this.node_cover.parentNode.removeChild(this.node_cover);

    var prop_true_duration, global_duration, true_duration;
    global_duration = this.scan('animation_out_duration');
    prop_true_duration = this.scan('animation_out_true_duration');

    true_duration = (prop_true_duration === undefined) ? 0 :
        (prop_true_duration.global ?
            Math.max(global_duration, prop_true_duration.len) :
            prop_true_duration);


    if (this.binder && !this.bound_out) {
      this._fnLocalBindOutExecuted();
    }
    setTimeout(function () {
        var after_pop_outs = self.scan('afterPopOut');

        for (var i = 0; i < after_pop_outs.length; i++)
            after_pop_outs[i](self, out_type);

        if (out_type === 'destroy') {
            // Clear the created timeouts and intervals for
            // alignment checks.
            var pop_timeouts = self.timeouts;
            var pop_intervals = self.intervals;
//            console.log(self);
            for (var i = 0; i < pop_timeouts.length; i++) {
                clearInterval(pop_timeouts[i]);
            }

            for (i = 0; i < pop_intervals.length; i++) {
                clearInterval(pop_intervals[i]);
            }
            // if position roller isn't set the roller isn't the parent of box and therefore we remove it separately
            if (!self.scan('position_roller')) self.node_roller.parentNode.removeChild(self.node_roller);
              self.destroyed = true;
        } else {
            self.hidden = true;
            // if position roller isn't set the roller isn't the parent of box and therefore we hide it separately
            if (!self.scan('position_roller')) cssClass.add(self.node_roller, 'popscript-display-none');
        }
    }, true_duration);
    this._animateOut();
    // Undo the body scrolling hack for enabling position roller if this
    // is the last roller pop.
    if (this.scan('position_roller') && numRollersLeft() === 1) {
        coverFix.unfix();
    }
    return false;
};

Pop.prototype.destroy = function() {
    this.out("destroy");
}
Pop.prototype.hide = function() {
    this.out("hide");
}


Pop.prototype.show = function() {

    self = this;
    if (!this.hidden) return false;
    if (this.scan('beforePopIn') && this.scan('beforePopIn')(this,false) === false) {
        return false;
    }

    if (this.scan('destroy')){
        setTimeout(self.out, this.scan('destroy'))
    }

    this._animateIn();

    cssClass.remove(this.node_cover, 'popscript-display-none');

    if (this.scan('position_roller')) {
        cssClass.remove(this.node_roller, 'popscript-display-none');
        coverFix.fix();
    } else {
        cssClass.remove(this.node_box, 'popscript-display-none');
    }

    this.hidden = false;

    this._noBlur(200);
    this.check();
}


Pop.prototype.toggle = function() {
    this.hidden ? this.show() : this.hide();
};

 function nearElement(node, cb, pop_dims) {
    var offset = pos.offset(node);
    var node_dims = dims.node(node, true);

    return cb(offset.left, offset.top, node_dims.w, node_dims.h, pop_dims.w, pop_dims.h);
};


 function checkValidPopClasses(pop_class) {
    var pop_class_list = other.trimString(pop_class).split(/[\s]+/);
    for (var i = 0; i < pop_class_list.length; i++) {
        if (!PS.compiled[pop_class_list[i]]) {
            return psError(3, "Inexistent Pop Class: '" + pop_class_list[i] + "'");
        }
    }
    return pop_class_list;
};

/*
 * Returns the total number of non-hidden pops with roller positions.
 */
function numRollersLeft() {
    var count = 0;
    for (var i=0,curPop; i < PS.pops.length; i++) {
        curPop = PS.pops[i]
            if (curPop && !curPop.hidden && curPop.scan('position_roller')) {
                count++;
            }
    }
    return count;
};
