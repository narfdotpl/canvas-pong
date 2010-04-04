function main() {
    var canvas = $('canvas#pong')[0];
    if (canvas.getContext) {
        var c = canvas.getContext('2d');

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
