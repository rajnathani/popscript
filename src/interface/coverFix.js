
    var orig_body_overflow;
    var count= 0;

     exports.fix = function () {
        if (!count++) {
            orig_body_overflow = document.body.style.overflow ? document.body.style.overflow : 'visible';
            document.body.style.overflow = 'hidden';
        }

    },
exports.unfix =      function () {

        if (!--count) {
            document.body.style.overflow = orig_body_overflow;
        }
    }
