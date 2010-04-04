function main() {
    var canvas = $('canvas#pong')[0];
    if (canvas.getContext) {
        var c = canvas.getContext('2d');

        // remember whether key is pressed
        var keys = {};
        $(document).keydown(function(e) { keys[e.keyCode] = true; });
        $(document).keyup(function(e) { keys[e.keyCode] = false; });

        // return function telling if key is pressed
        function isPressed(keyCode) {
            return function() {
                keys[keyCode];
            };
        }

        // set border line parameters
        var borderThickness = 2;
        c.fillStyle = '#000';

        // draw top and bottom border lines
        c.fillRect(0, 0, canvas.width, borderThickness);
        c.fillRect(0, canvas.height - borderThickness, canvas.width,
                   borderThickness);
    }
}

main();
