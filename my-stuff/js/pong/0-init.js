// require jQuery
var jQuery; if (!jQuery) throw new Error('jQuery module has not been loaded');


// create pong namespace
var pong = {};


// try to use requestAnimationFrame
//
// +- COPYPASTA from
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
                                   window.mozRequestAnimationFrame    ||
                                   window.oRequestAnimationFrame      ||
                                   window.msRequestAnimationFrame     ||
                                   function (callback) {
                                       window.setTimeout(callback, 1000 / 60);
                                   };
}
