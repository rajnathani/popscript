
exports.offset = offset;
exports.mouse = mouse;
exports.scrolled = scrolled;
exports.isFixed = isFixed;

    /*
     * Returns the offset of the element `el`,
     * relative to element `rel`. `rel` is optional,
     * if left out, assume `rel` to be the window.
     * in an object with keys 'top' and 'left'
     * @param `el` {DOM Node Element}
     * @param `rel` {DOM Node Element}
     * @returns {object}
     */
    function offset (el, rel) {
        if (el.style.position === 'fixed') {
            return el.getBoundingClientRect()
        }
        //return el.getBoundingClientRect(); //WARNING: this line will not work here
        // Source: http://www.quirksmode.org/js/findpos.html
        var cur_left = 0;
        var cur_top = 0;
        if (el.offsetParent) {
            do {
                cur_left += el.offsetLeft;
                cur_top += el.offsetTop;

            } while ((el = el.offsetParent) && el !== rel);
        }
        return {left: cur_left, top: cur_top};

    }
    /*
     * Returns the mouse position relative to element `obj`.
     * If `obj` is mentioned assume that `obj` is window
     */
    function mouse (e, obj) {
        // Source: http://www.quirksmode.org/js/events_properties.html
        var posx = 0;
        var posy = 0;
        if (!e) var e = window.event;
        if (e.pageX) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else {
            posx = e.clientX + document.body.scrollLeft
                + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop
                + document.documentElement.scrollTop;
        }
        // special thanks: http://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
        if (obj && obj !== window) {
            var offset = pos.offset(obj);
            var scrolled = pos.scrolled();

            return [(posx - offset.left) + scrolled.x, (posy - offset.top) + scrolled.y];
        }

        return [posx, posy];

    }
    /*
     Returns an object containing
     information of the magnitude of
     x (key 'x') and y (key 'y')
     scrolled in the the element `obj`.
     If `obj` is not mentioned then assume `obj` is the window;
     @param `obj` {element}
     @returns {object} containing two keys (both values are numbers)
     */
    function scrolled (obj) {

        if (!obj || obj === window) {
            return {y: Math.max(window.scrollY,
                document.documentElement.scrollTop,
                document.body.scrollTop),
                x: Math.max(window.scrollX,
                    document.documentElement.scrollLeft,
                    document.body.scrollLeft)};
        }
        return {y: obj.scrollTop, x: obj.scrollLeft}

    }
    function isFixed (ele) {

        return ((ele.style && ele.style.position === 'fixed') || (!(ele.style && ele.style.position) && ele.tagName &&
            window.getComputedStyle(ele, null) &&
            window.getComputedStyle(ele, null).getPropertyValue('position') === 'fixed')) ||
            (ele.parentNode && isFixed(ele.parentNode));
    }
