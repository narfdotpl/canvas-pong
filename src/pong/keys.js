// require pong
var pong; if (!pong) throw new Error('pong module has not been loaded');


// remember whether key is pressed
pong.keys = {};
$(document).
    keydown(function (e) {pong.keys[e.keyCode] = true;}).
    keyup(function (e) {pong.keys[e.keyCode] = false;});

// return function telling whether key is pressed
pong.key = function (keyCode) {
    return function () {
        return pong.keys[keyCode];
    };
};
