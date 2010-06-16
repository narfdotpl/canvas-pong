// require pong
var pong; if (!pong) throw new Error('pong module has not been loaded');


pong.play = function (canvas) {
    if (canvas.getContext) {

        //----------------
        //  setup basics
        //----------------

        var c = canvas.getContext('2d'),
            WIDTH = canvas.width,
            HEIGHT = canvas.height,
            FPS = 30;


        //--------------------------
        //  create controls screen
        //--------------------------

        var controlsScreen = new pong.ControlsScreen(c, WIDTH, HEIGHT);


        //------------------
        //  create borders
        //------------------

        // set common border lines parameters and create borders
        var borderThickness = 1,
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
                createShuttlecocks();
            }
        }


        //-----------------------------------
        //  create rackets and shuttlecocks
        //-----------------------------------

        // set common parameters
        var yMin = 2 * borderThickness,
            yMax = HEIGHT - yMin;

        // create rackets
        function createRackets() {
            delete objects.fromPreviousGame.rackets;
            objects.fromPreviousGame.rackets = objects.fromCurrentGame.rackets;
            var rackets = objects.fromCurrentGame.rackets = [];

            // set common rackets parameters
            var racketWidth = 4,
                racketHeight = 80,
                acceleration = 10;

            // create left racket
            rackets.push(new pong.Racket(c, {
                x: 2,
                y: (HEIGHT - racketHeight) / 2,
                width: racketWidth,
                height: racketHeight,
                acceleration: acceleration,
                up: pong.key(87),  // w
                down: pong.key(83),  // s
                limits: {
                    y: {min: yMin, max: yMax},
                    v: {max: 20}
                }
            }));

            // create right racket
            rackets.push(new pong.Racket(c, {
                x: WIDTH - racketWidth - 2,
                y: (HEIGHT - racketHeight) / 2,
                width: racketWidth,
                height: racketHeight,
                acceleration: acceleration,
                up: pong.key(38),  // up arrow
                down: pong.key(40),  // down arrow
                limits: {
                    y: {min: yMin, max: yMax},
                    v: {max: 20}
                }
            }));
        }
        createRackets();

        // create shuttlecocks
        function createShuttlecocks() {
            function fractionWithRandomSign(x, min, max) {
                var sign = Math.random() < 0.5 ? -1 : 1;
                return sign * x * (min + (max - min) * Math.random());
            }

            delete objects.fromPreviousGame.shuttlecocks;
            objects.fromPreviousGame.shuttlecocks =
                objects.fromCurrentGame.shuttlecocks;

            var shuttlecocks = objects.fromCurrentGame.shuttlecocks = [],
                rackets = objects.fromCurrentGame.rackets,
                limits = {
                    x: {min: 0, max: WIDTH},
                    y: {min: yMin, max: yMax},
                    vx: {max: 20},
                    vy: {max: 10}
                };

            shuttlecocks.push(new pong.Shuttlecock(c, {
                x: WIDTH / 2,
                y: HEIGHT / 2,
                vx: fractionWithRandomSign(limits.vx.max, 0.55, 0.8),
                vy: fractionWithRandomSign(limits.vy.max, 0.2, 0.6),
                length: 30,
                rackets: rackets,
                endGameCallback: endGame,
                limits: limits
            }));
        }
        createShuttlecocks();


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
            // draw borders
            _drawAll(borders);

            // save context
            c.save();

            // draw objects from previous game
            c.globalAlpha = transition.getPreviousGameAlpha();
            _drawAll(objects.fromPreviousGame.rackets);
            _drawAll(objects.fromPreviousGame.shuttlecocks);

            // draw objects from current game
            c.globalAlpha = transition.getCurrentGameAlpha();
            _drawAll(objects.fromCurrentGame.rackets);
            _drawAll(objects.fromCurrentGame.shuttlecocks);

            // restore context
            c.restore();
        }

        function _moveAll(arr, arg) {
            if (arr) {
                for (var i = 0; i < arr.length; i++) {
                    arr[i].move(arg);
                }
            }
        }

        function moveShuttlecocks() {
            _moveAll(objects.fromCurrentGame.shuttlecocks);
        }

        function moveRackets() {
            _moveAll(objects.fromPreviousGame.rackets);
            _moveAll(objects.fromCurrentGame.rackets);
        }


        //--------
        //  play
        //--------

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
                        moveShuttlecocks();
                    }
                }
            }
        }, 1000 / FPS);
    }
};
