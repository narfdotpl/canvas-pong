function main() {
    var canvas = $('canvas#pong')[0];
    if (canvas.getContext) {
        var c = canvas.getContext('2d');
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
        var FPS = 30;

        // remember whether key is pressed
        var keys = {};
        $(document).keydown(function(e) { keys[e.keyCode] = true; });
        $(document).keyup(function(e) { keys[e.keyCode] = false; });

        // return function telling if key is pressed
        function key(keyCode) {
            return function() {
                return keys[keyCode];
            };
        }

        // Racket
        function Racket(kwargs) {
            // kwargs: x, y, width, height, yMin, yMax, up(), down()
            for (var k in kwargs) {
                this[k] = kwargs[k];
            }
            this.yMax -= this.height;

            this.hitBall = function(ball) {
                return false;
            };

            this.move = function() {
                if (this.up()) {
                    this.y -= 10;
                } else if (this.down()) {
                    this.y += 10;
                }

                // dont cross borders
                if (this.y < this.yMin) {
                    this.y = this.yMin;
                } else if (this.y > this.yMax) {
                    this.y = this.yMax;
                }
            };

            this.draw = function() {
                this.move();
                c.fillRect(this.x, this.y, this.width, this.height);
            };
        }

        // Ball
        function Ball(kwargs) {
            // kwargs: x, y, r, vx, vy, yMin, yMax, rackets
            for (var k in kwargs) {
                this[k] = kwargs[k];
            }
            this.yMin += this.r;
            this.yMax -= this.r;

            this.move = function() {
                this.x += this.vx;
                this.y += this.vy;

                // bounce from borders
                if (this.y < this.yMin) {
                    this.y = this.yMin;
                    this.vy = Math.abs(this.vy);
                } else if (this.y > this.yMax) {
                    this.y = this.yMax;
                    this.vy = - Math.abs(this.vy);
                } else {
                    // bounce from rackets
                    for (var i = 0; i < this.rackets.length; i++) {
                        if (this.rackets[i].hitBall(this)) {
                            break;
                        }
                    }
                }
            };

            this.draw = function() {
                this.move();
                c.beginPath();
                c.arc(this.x, this.y, this.r, 0, 2 * Math.PI, true);
                c.fill();
            };
        }

        // set border line parameters
        var borderThickness = 2;
        c.fillStyle = '#000';

        // draw top and bottom border lines
        c.fillRect(0, 0, WIDTH, borderThickness);
        c.fillRect(0, HEIGHT - borderThickness, WIDTH,
                   borderThickness);

        // set common racket parameters
        var racketWidth = 20;
        var racketHeight = 80;
        var yMin = 2 * borderThickness;
        var yMax = HEIGHT - yMin;

        // create left racket
        var leftRacket = new Racket({
            x: 2,
            y: (HEIGHT - racketHeight) / 2,
            width: racketWidth,
            height: racketHeight,
            yMin: yMin,
            yMax: yMax,
            up: key(87),  // w
            down: key(83)  // s
        });

        // create right racket
        var rightRacket = new Racket({
            x: WIDTH - racketWidth - 2,
            y: (HEIGHT - racketHeight) / 2,
            width: racketWidth,
            height: racketHeight,
            yMin: yMin,
            yMax: yMax,
            up: key(38),  // up arrow
            down: key(40)  // down arrow
        });

        // create ball
        var ball = new Ball({
            x: WIDTH / 2,
            y: HEIGHT / 2,
            r: 15,
            vx: -1,
            vy: 3,
            yMin: yMin,
            yMax: yMax,
            rackets: [leftRacket, rightRacket]
        });

        // draw rackets
        setInterval(function() {
            // clear everything apart borders
            c.clearRect(0, borderThickness,
                        WIDTH, HEIGHT - 2 * borderThickness);

            // draw rackets
            leftRacket.draw();
            rightRacket.draw();

            // draw ball
            ball.draw();
        }, 1000 / FPS);
    }
}

main();
