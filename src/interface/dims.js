
exports.docHeight = docHeight;
exports.node = node;
exports.auto = auto;
exports.win = win;
exports.cover = cover;
/*
Returns the height (in pixels) of the visible document.
@returns {Number}
*/
function docHeight() {
    var body_dims = node(document.getElementsByTagName("html")[0], true);
    return Math.max(body_dims.h, win().height);

}

/*
Returns the dimensions (height and width) (within an object) of the DOM node `node`.
@param `node` {DOM Node}
@param `in_doc` {boolean} Specifies whether the node is already
a part of the document object.
@returns {object}  key h is the height, key w is the width.
*/
function node(node, part_of_doc) {
    if (!node) return;
        // dimension object
        if (!part_of_doc) {  // Not a part of the document

            var dim = {};

            // temporarily add a clone of the node to the document to check its dimensions
            node.style.visibility = 'hidden';
            node.id = "popscript-check-popup-dimensions";

            document.body.appendChild(node);
            var appended_node = document.getElementById("popscript-check-popup-dimensions");

            dim.h = appended_node.offsetHeight;
            dim.w = appended_node.offsetWidth;
            node.style.visibility = "visible";
            document.body.removeChild(appended_node);
            return dim;
        }
        // Else its already a part of the document
        return {h: node.offsetHeight, w: node.offsetWidth}

    }


    /*
    Returns the pixel value of the auto y/x
    or custom alignment of a box of `pop_dimension`
    @param `pop_attr` {number}
    @param `window_dimension` {number}
    @param `pop_dimensions` {object} 2 element object containing numbers
    @param `scrolled` {number}
    @param `percent_based` {boolean} position is percent based or not
    @returns {number}
    */
    function auto(pop_attr, window_dimension, pop_dimensions, scrolled, percent_based) {
        if (pop_attr === "auto") {
            if (pop_dimensions >= window_dimension) {
                return scrolled;
            }
            else {

                return (parseInt((window_dimension - (pop_dimensions)) / 2.0)) + scrolled
            }

        } else {

            if (percent_based) {
                return scrolled + (parseFloat(window_dimension) * pop_attr);
            } else {

                return scrolled + pop_attr;
            }


        }


    };
    /*
    Returns the dimensions (height & width) of the window in the form of
    an object.
    */
    //Source: http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
    function win() {
        var d = {};
        if (typeof( window.innerWidth ) == 'number') {
            //Non-IE
            d.width = window.innerWidth;
            d.height = window.innerHeight;
        } else if (document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight )) {
            //IE 6+ in 'standards compliant mode'
            d.width = document.documentElement.clientWidth;
            d.height = document.documentElement.clientHeight;
        } else if (document.body && ( document.body.clientWidth || document.body.clientHeight )) {
            //IE 4 compatible
            d.width = document.body.clientWidth;
            d.height = document.body.clientHeight;
        }

        return d;
    }

    /*
    Create, style, and return a node according to cover dimensions.
    This has the use cases of:
    (1) cover
    (2) roller
    @returns {node}
    */
    function cover() {
        var cover_type_node = document.createElement('div');
        cover_type_node.style.position = 'absolute';
        cover_type_node.style.overflow = 'auto';
        cover_type_node.style.width = '100%';
        cover_type_node.style.top = '0';
        cover_type_node.style.left = '0';
        cover_type_node.style.right = '0';
        return cover_type_node;
    }
