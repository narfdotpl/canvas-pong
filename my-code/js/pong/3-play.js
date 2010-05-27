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


        //------------------
        //  create borders
        //------------------

        // set common border lines parameters and create borders
        var borderThickness = 2,
            borders = [];

        // create top border
        borders.push(new pong.Border(c, {
            x: 0,
            y: 0,
            width: WIDTH,
            height: borderThickness
        }));

        // create bottom border
        borders.push(new pong.Border(c, {
            x: 0,
            y: HEIGHT - borderThickness,
            width: WIDTH,
            height: borderThickness
        }));


        //---------------------------------------------------------------
        //  create container for objects from previous and current game
        //---------------------------------------------------------------

        var objects = {  // love generic names :F
            fromPreviousGame: [],
            fromCurrentGame: []
        };


        //----------------------------------------------------
        //  create transition object and "end game" callback
        //----------------------------------------------------

        var transition = new pong.Transition();

        function endGame() {
            if (transition.done) {
                transition.start();
                createRackets();
                createBalls();
            }
        }


        //----------------------------
        //  create rackets and balls
        //----------------------------

        // set common parameters
        var yMin = 2 * borderThickness,
            yMax = HEIGHT - yMin;

        // create rackets
        function createRackets() {
            delete objects.fromPreviousGame.rackets;
            objects.fromPreviousGame.rackets = objects.fromCurrentGame.rackets;
            var rackets = objects.fromCurrentGame.rackets = [];

            // set common rackets parameters
            var racketWidth = 20,
                racketHeight = 80;

            // create left racket
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
                height: racketHeight,
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
        }
        createRackets();

        // create balls
        function createBalls() {
            delete objects.fromPreviousGame.balls;
            objects.fromPreviousGame.balls = objects.fromCurrentGame.balls;
            var balls = objects.fromCurrentGame.balls = [],
                rackets = objects.fromCurrentGame.rackets;

            balls.push(new pong.Ball(c, {
                x: WIDTH / 2,
                y: HEIGHT / 2,
                r: 15,
                vx: 15,
                vy: -1,
                xMin: 0,
                xMax: WIDTH,
                yMin: yMin,
                yMax: yMax,
                maxSpeed: 20,
                maxStretch: 1.5,
                rackets: rackets,
                endGameCallback: endGame
            }));

            balls.push(new pong.Ball(c, {
                x: WIDTH / 2,
                y: HEIGHT / 2,
                r: 10,
                vx: 7,
                vy: 3,
                xMin: 0,
                xMax: WIDTH,
                yMin: yMin,
                yMax: yMax,
                maxSpeed: 20,
                maxStretch: 1.5,
                rackets: rackets,
                endGameCallback: endGame
            }));

            balls.push(new pong.Ball(c, {
                x: WIDTH / 2,
                y: HEIGHT / 2,
                r: 5,
                vx: 5,
                vy: -3,
                xMin: 0,
                xMax: WIDTH,
                yMin: yMin,
                yMax: yMax,
                maxSpeed: 20,
                maxStretch: 1.5,
                rackets: rackets,
                endGameCallback: endGame
            }));
        }
        createBalls();


        //--------------------------
        //  create handy functions
        //--------------------------

        function clearCanvas() {
            c.clearRect(0, 0, WIDTH, HEIGHT);
        }

        function _drawAll(arr) {
            if (arr) {
                for (var i = 0; i < arr.length; i++) {
                    arr[i].draw();
                }
            }
        }

        function drawAllObjects() {
            _drawAll(borders);

            c.save();
            c.globalAlpha = transition.getPreviousGameAlpha();
            _drawAll(objects.fromPreviousGame.rackets);
            _drawAll(objects.fromPreviousGame.balls);

            c.globalAlpha = transition.getCurrentGameAlpha();
            _drawAll(objects.fromCurrentGame.rackets);
            _drawAll(objects.fromCurrentGame.balls);
            c.restore();
        }

        function _moveAll(arr, arg) {
            if (arr) {
                for (var i = 0; i < arr.length; i++) {
                    arr[i].move(arg);
                }
            }
        }

        function moveBalls() {
            _moveAll(objects.fromPreviousGame.balls, true);
            _moveAll(objects.fromCurrentGame.balls);
        }

        function moveRackets() {
            _moveAll(objects.fromPreviousGame.rackets);
            _moveAll(objects.fromCurrentGame.rackets);
        }


        //--------
        //  play
        //--------

        // apply position constraints
        moveRackets();

        setInterval(function () {
            if (pong.paused) {
                if (!controlsScreen.fadedIn) {
                    clearCanvas();
                    drawAllObjects();
                    controlsScreen.fadeIn();
                }
            } else {
                clearCanvas();
                drawAllObjects();
                if (!controlsScreen.fadedOut) {
                    controlsScreen.fadeOut();
                } else {
                    moveRackets();
                    if (!transition.done) {  // transition from previous game
                        transition.process();  // can't use "do" token :/
                    } else {
                        moveBalls();
                    }
                }
            }
        }, 1000 / FPS);
    }
};
