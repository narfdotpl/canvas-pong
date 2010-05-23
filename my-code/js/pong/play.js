// require pong
var pong; if (!pong) throw new Error('pong module has not been loaded');


pong.play = function (canvas) {
    if (canvas.getContext) {
        var c = canvas.getContext('2d'),
            WIDTH = canvas.width,
            HEIGHT = canvas.height,
            FPS = 30;

        // set border line parameters
        var borderThickness = 2;
        c.fillStyle = '#000';

        // draw top and bottom border lines
        c.fillRect(0, 0, WIDTH, borderThickness);
        c.fillRect(0, HEIGHT - borderThickness, WIDTH, borderThickness);

        // set common racket parameters
        var racketWidth = 20,
            racketHeight = 80,
            yMin = 2 * borderThickness,
            yMax = HEIGHT - yMin;

        // create left racket
        var rackets = []
        rackets.push(new pong.Racket(c, {
            x: 2,
            y: (HEIGHT - racketHeight) / 2,
            width: racketWidth,
            height: racketHeight * 4.8,
            yMin: yMin,
            yMax: yMax,
            up: pong.key(87),  // w
            down: pong.key(83)  // s
        }));

        // create right racket
        rackets.push(new pong.Racket(c, {
            x: WIDTH - racketWidth - 2,
            y: (HEIGHT - racketHeight) / 2,
            width: racketWidth,
            height: racketHeight * 4.8,
            yMin: yMin,
            yMax: yMax,
            up: pong.key(38),  // up arrow
            down: pong.key(40)  // down arrow
        }));

        // create middle racket
        rackets.push(new pong.Racket(c, {
            x: WIDTH / 2,
            y: (HEIGHT - racketHeight) / 2,
            width: racketWidth,
            height: racketHeight,
            yMin: yMin,
            yMax: yMax,
            up: pong.key(38),  // up arrow
            down: pong.key(40)  // down arrow
        }));

        // create balls
        var balls = [];
        balls.push(new pong.Ball(c, {
            x: WIDTH / 2,
            y: HEIGHT / 2,
            r: 15,
            vx: 15,
            vy: -1,
            yMin: yMin,
            yMax: yMax,
            maxSpeed: 20,
            maxStretch: 1.5,
            rackets: rackets
        }));

        balls.push(new pong.Ball(c, {
            x: WIDTH / 2,
            y: HEIGHT / 2,
            r: 10,
            vx: 7,
            vy: 3,
            yMin: yMin,
            yMax: yMax,
            maxSpeed: 20,
            maxStretch: 1.5,
            rackets: rackets
        }));

        balls.push(new pong.Ball(c, {
            x: WIDTH / 2,
            y: HEIGHT / 2,
            r: 5,
            vx: 5,
            vy: -3,
            yMin: yMin,
            yMax: yMax,
            maxSpeed: 20,
            maxStretch: 1.5,
            rackets: rackets
        }));

        // draw rackets and balls
        setInterval(function () {
            if (!pong.paused) {
                // clear everything apart from borders
                c.clearRect(0, borderThickness,
                            WIDTH, HEIGHT - 2 * borderThickness);

                // draw and move rackets
                for (var i = 0; i < rackets.length; i++) {
                    rackets[i].drawAndMove();
                }

                // draw and move balls
                for (var i = 0; i < balls.length; i++) {
                    balls[i].drawAndMove();
                }
            }
        }, 1000 / FPS);
    }
};
