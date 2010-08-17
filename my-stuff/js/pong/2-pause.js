// require pong
var pong; if (!pong) throw new Error('pong module has not been loaded');


// toggle pause with space
pong.paused = true;
pong.keys.spaceDown = false;
$(document).
    keydown(function (e) {
        if (e.keyCode == 32) {
            if (!pong.keys.spaceDown) {
                pong.paused = !pong.paused;
                pong.keys.spaceDown = true;
            }
            return false;
        }
    }).
    keyup(function (e) {
        if (e.keyCode == 32) {
            pong.keys.spaceDown = false;
        }
    });
