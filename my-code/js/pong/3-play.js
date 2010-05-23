// require pong
var pong; if (!pong) throw new Error('pong module has not been loaded');


pong.play = function (canvas) {
    if (canvas.getContext) {
        // setup basics
        var c = canvas.getContext('2d'),
            WIDTH = canvas.width,
            HEIGHT = canvas.height,
            FPS = 30;

        // create controls screen
        var controlsScreen = new pong.ControlsScreen(c, WIDTH, HEIGHT);


        //---------------------------
        //  create drawable objects
        //---------------------------

        var objects = [];

        // set common border lines parameters
        var borderThickness = 2;

        // set common rackets parameters
        var racketWidth = 20,
            racketHeight = 80,
            yMin = 2 * borderThickness,
            yMax = HEIGHT - yMin;

        // create left racket
        objects.push(new pong.Racket(c, {
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
        objects.push(new pong.Racket(c, {
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
        objects.push(new pong.Racket(c, {
            x: WIDTH / 2,
            y: (HEIGHT - racketHeight) / 2,
            width: racketWidth,
            height: racketHeight,
            yMin: yMin,
            yMax: yMax,
            up: pong.key(38),  // up arrow
            down: pong.key(40)  // down arrow
        }));

        // easily refer to rackets
        var rackets = objects.slice();

        // create balls
        objects.push(new pong.Ball(c, {
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

        objects.push(new pong.Ball(c, {
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

        objects.push(new pong.Ball(c, {
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

        // create top border
        objects.push(new pong.Border(c, {
            x: 0,
            y: 0,
            width: WIDTH,
            height: borderThickness
        }));

        // create bottom border
        objects.push(new pong.Border(c, {
            x: 0,
            y: HEIGHT - borderThickness,
            width: WIDTH,
            height: borderThickness
        }));


        //--------------------------
        //  create handy functions
        //--------------------------

        function clearCanvas() {
            c.clearRect(0, 0, WIDTH, HEIGHT);
        }

        function drawObjects() {
            for (var i = 0; i < objects.length; i++) {
                objects[i].draw();
            }
        }

        function moveObjects() {
            for (var i = 0; i < objects.length; i++) {
                objects[i].move();
            }
        }


        //--------
        //  play
        //--------

        // apply
        moveObjects();

        setInterval(function () {
            if (pong.paused) {
                if (!controlsScreen.fadedIn) {
                    clearCanvas();
                    drawObjects();
                    controlsScreen.fadeIn();
                }
            } else {
                clearCanvas();
                drawObjects();
                if (!controlsScreen.fadedOut) {
                    controlsScreen.fadeOut();
                } else {
                    moveObjects();
                }
            }
        }, 1000 / FPS);
    }
};
