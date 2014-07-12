var cssClass = require('../helper/cssClass.js');

/*
 * Adds animation to the given node.
 * After the maximum duration if the `out_type`
 * is mentioned then perform one of the either depending
 * on the value of `out_type`
 * (1) "destroy" In this case remove the node from DOM
 * (2) "hide" In this case apply a display none to the node's CSS
 * following the above 2 also call the respective afterPopOut callback
 * supplying the out_type to it.
 */
module.exports = function(node, value, global_duration, out_type) {

    var end_of_node_out = function () {
        if (out_type) {
            if (node.parentNode.className === 'popscript-roller') {
                if (out_type === "destroy")
                    node.parentNode.parentNode.removeChild(node.parentNode);
                else
                    cssClass.add(node.parentNode, 'popscript-display-none');
            }
            else {
                if (out_type === "destroy")
                    node.parentNode.removeChild(node);
                else
                    cssClass.add(node, 'popscript-display-none');
            }
        }

    };
    if (animationPossible()) {
        // `animations` contains the value for the CSS property `animation`
        // `durations` contains the value for the CSS property `animation-duration`
        // `ani_max_duration` contains the value for the maximum animation duration found in `animation`
        // `max_duration` contains the value for `uni_max_duration` if defined else the value of `global_duration`
        var animations, ani_max_duration, max_duration, durations;

        animations = value[0];
        durations = value[1];

        // Check function convert.ani for more details on this step
        durations = durations.replace(/\$g/g, global_duration + "ms");

        node.style.animation = animations;
        node.style.webkitAnimation = animations;

        node.style.animationDuration = durations;
        node.style.webkitAnimationDuration = durations;

        if (out_type) {
            ani_max_duration = value[2];
            max_duration = (ani_max_duration === undefined ? global_duration : ani_max_duration);

            setTimeout(end_of_node_out, max_duration);

        }
    } else {
        end_of_node_out();
    }

};

/*
 Returns true if CSS animation is supported by the browser,
 false otherwise.
 @returns (boolean)
 */
  //Source: Mozilla Development Network
    function animationPossible() {

        var animation = false,
            animationstring = 'animation',
            keyframeprefix = '',
            domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
            pfx  = '';

        if( document.body.style.animationName !== undefined ) { animation = true; }

        if( animation === false ) {
            for( var i = 0; i < domPrefixes.length; i++ ) {
                if( document.body.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
                    pfx = domPrefixes[ i ];
                    animationstring = pfx + 'Animation';
                    keyframeprefix = '-' + pfx.toLowerCase() + '-';
                    animation = true;
                    break;
                }
            }
        }
        return animation;
    };
