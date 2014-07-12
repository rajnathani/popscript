var other = require('./other.js');

module.exports = {
    /*
     Returns an array of elements of the class name `class_name`,
     within the context of element `parent`, if `parent`
     is not specified the context to look within is the
     entire document. In the case of `parent` being
     specified, include it also within the scope.
     @param `class_name` {string}
     @param `parent` {DOM Node Element}
     @returns {array}
     */
    nodes: function (class_name, parent) {
        // Check if parent is specified
        if (!parent) {
            parent = document; // if not then the document will be the parent
        }
        var all_of_class = [];
        // Check if the browser natively supports
        // the method getcss_class.elementsName
        if (parent.getElementsByClassName) {
            all_of_class = parent.getElementsByClassName(class_name);
        }
        // Check if it supports querySelectorAll (IE 8 supports
        else if (parent.querySelectorAll) {
            all_of_class = parent.querySelectorAll(class_name);
        }

        else { // Else the browser being used is a legacy browser
            // Scan through all the elements and look for the
            // popscript boxes
            var all_elements = parent.getElementsByTagName('*');
            for (var i = 0; i < all_elements.length; i++) {
                if (all_elements[i].className && this.has(all_elements[i], class_name)) {
                    all_of_class.push(all_elements[i]);
                }
            }
        }

        // Check if the parent is not document,
        // in this case it should also be included
        // within the search
        if (parent !== document && this.has(parent, class_name)) {
            all_of_class = other.cloneSingleLevel(all_of_class);
            all_of_class.push(parent);
        }
        return all_of_class;
    },

    /*
     Returns true if `class_name` belongs
     to the DOM node element `el`, false otherwise.
     @param `el` {DOM Node Element}
     @param `class_name` {string}
     @returns {boolean}
     */
    has: function (el, class_name) {
        if (!el.className) {
            return false
        }
        return el.className.split(/ +/).indexOf(class_name) !== -1;
    },
    /*
     Adds the css class `class_name`
     to the DOM node element `el`.
     @param `el` {DOM Node Element}
     @param `class_name` {string}
     */
    add: function (el, class_name) {
        if (!this.has(el, class_name))
            el.className = el.className ? (el.className + " " + class_name) : class_name;
    },

    /*
     Removes the css class `class_name`
     to the DOM node element `el`.
     @param `el` {DOM Node Element}
     @param `class_name` {string}
     */
    remove: function (el, class_name) {
        if (this.has(el, class_name)) {
            el.className = el.className.replace(new RegExp(" ?" + class_name), "");
        }
    }

};
