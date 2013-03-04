"use strict"

//Config Variables

var popupClass = 'popup-popup';
var coverClass = 'popup-cover';
var closePopupClass = 'close-popup'

//Optional (for animations (on popup cancel)
var back_animation_out_class_name = '';
var popup_animation_out_class_name = '';
var animation_out_length = 0;


//Source: Mozilla Development Network
function animationPossible(){

    var animation = false;
    var animationstring = 'animation';
    var keyframeprefix = '';
    var domPrefixes = 'Webkit O MS MOZ'.split(' ');
    pfx  = '';

    if( elm.style.animationName ) { animation = true; }

    if( animation === false ) {
        for( var i = 0; i < domPrefixes.length; i++ ) {
            if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
                var pfx = domPrefixes[ i ];
                animationstring = pfx + 'Animation';
                keyframeprefix = '-' + pfx.toLowerCase() + '-';
                animation = true;
                break;
            }
        }
    }

    return animation;
}

function get_doc_height() {
    return Math.max(
        Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
        Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
        Math.max(document.body.clientHeight, document.documentElement.clientHeight)
    );
}


function get_inner_height(){
    return window.innerHeight;
}

function get_scrolled(){
    return Math.max(window.scrollY, document.body.scrollTop);
}

function pop_up(content ){

    var backy = document.createElement('div');
    backy.style.height = get_doc_height() + "px";
    backy.style.position = 'absolute';
    backy.style.width = '100%';
    backy.style.top = '0';
    backy.style.left = '0';
    backy.style.right = '0';
    backy.style.zIndex = '999999';
    backy.className = coverClass;
    backy.id = 'relfor-popup-cover';

    var popy = document.createElement('div');
    popy.style.margin = 'auto';
    popy.style.position = 'relative';
    backy.style.zIndex = '1000000';
    popy.id = 'relfor-popup';

    popy.className = popupClass;


    popy.style.marginTop = ((get_inner_height()/3.45 + get_scrolled()) + "px");


    var close = document.createElement('span');
    close.className = closePopupClass;
    close.innerHTML = 'x';

    close.onclick = function(){
        pop_out();
    };

    var content_area;
    if ((content.substring) !== undefined){
        content_area = document.createElement('p');
        content_area.appendChild(document.createTextNode(content));
    }else{
        content_area = content;
    }

    popy.appendChild(close);
    popy.appendChild(content_area);

    backy.appendChild(popy);

    document.body.appendChild(backy);

    document.onkeydown = function(){
        if ((window.event).keyCode == 27){
            pop_out();
        }
    }

}

function pop_out(){
    document.onkeydown = function(){};
    var animate_out_dict = {};
    animate_out_dict[document.getElementById('relfor-popup')] = popup_animation_out_class_name;
    animate_out_dict[document.getElementById('relfor-popup-cover')] = back_animation_out_class_name;
    animate_out(animation_out_length, document.getElementById('relfor-popup-cover'),
        animate_out_dict);
}


function animate_out(delay_length, main, todo){
    var delay = 0;

    if ((!animationPossible) || (delay_length !== 0)){
        delay = delay_length - 30;
        setTimeout(function(){main.remove(); }, delay);
        for (var key in todo){
            var value = todo[key];
            key.className += (" " + value);
        }
    } else{
        main.remove();
    }


}