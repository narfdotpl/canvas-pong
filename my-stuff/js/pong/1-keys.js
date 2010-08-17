// require pong
var pong; if (!pong) throw new Error('pong module has not been loaded');


// remember whether key is pressed
pong.keys = {};
$(document).
    keydown(function (e) {
        pong.keys[e.keyCode] = true;

        // don't scroll the page when up or down arrow is pressed
        if (e.keyCode == 38 || e.keyCode == 40) {
            return false;
        }
    }).
    keyup(function (e) {
        pong.keys[e.keyCode] = false;
    });

// return function telling whether key is pressed
pong.key = function (keyCode) {
    return function () {
        return pong.keys[keyCode];
    };
};
