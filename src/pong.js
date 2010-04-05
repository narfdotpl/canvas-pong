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
            // x, y, width, height, yMin, yMax, up(), down()
            for (var k in kwargs) {
                this[k] = kwargs[k];
            }
            this.yMax -= this.height;
            this.halfWidth = this.width / 2;
            this.halfHeight = this.height / 2;
            this.v = 0;

            this.hitBall = function(ball) {
                // treat ball like square inscribed in circle of ball.r radius

                // compute center distances
                var xDist = ball.x - (this.x + this.halfWidth);
                var xDistAbs = Math.abs(xDist);
                var yDist = ball.y - (this.y + this.halfHeight);
                var yDistAbs = Math.abs(yDist);

                // check for collisions
                if (xDistAbs <= this.halfWidth + ball.halfSide) {
                    if (yDistAbs <= this.halfHeight + ball.halfSide) {
                        if (yDistAbs < this.halfHeight) {
                            // bounce from left/right
                            var sign = xDist >= 0 ? 1 : -1;
                            ball.vx = sign * Math.abs(ball.vx);
                        } else {
                            // bounce from top/bottom
                            var sign = yDist >= 0 ? 1 : -1;
                            ball.vy = sign * Math.abs(ball.vy);
                        }
                        ball.vy += 0.1 * this.v;
                        ball.vx *= 1.02;
                        return true;
                    }
                }

                // no collision
                return false;
            };

            this.move = function() {
                this.y += this.v;

                // keyboard
                if (this.up()) {
                    if (this.v > 0) {
                        this.v = 0;
                    }
                    this.v -= 2;
                } else if (this.down()) {
                    if (this.v < 0) {
                        this.v = 0;
                    }
                    this.v += 2;
                } else {
                    this.v = 0;
                }

                // dont cross borders
                if (this.y < this.yMin) {
                    this.y = this.yMin;
                    this.v = 0;
                } else if (this.y > this.yMax) {
                    this.y = this.yMax;
                    this.v = 0;
                }
            };

            this.draw = function() {
                this.move();
                c.beginPath();
                c.rect(this.x, this.y, this.width, this.height);
                c.stroke();
            };
        }

        // Ball
        function Ball(kwargs) {
            // x, y, r, vx, vy, yMin, yMax, maxSpeed, maxStretch, rackets
            for (var k in kwargs) {
                this[k] = kwargs[k];
            }

            this.yMin += this.r;
            this.yMax -= this.r;
            this.halfSide = this.r / Math.sqrt(2);  // for racket collision

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

                // ellipse
                c.save();

                var angle = Math.atan(this.vy / this.vx);
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);

                var speedRatio = (this.vx * this.vx + this.vy * this.vy) /
                                 (this.maxSpeed * this.maxSpeed);
                var scaleX = 1 + speedRatio * (this.maxStretch - 1);
                if (scaleX > this.maxStretch) {
                    scaleX = this.maxStretch;
                }
                var scaleY = 1 / scaleX;

                c.transform(scaleX * cos, sin, -sin, scaleY * cos,
                            this.x, this.y);

                c.beginPath();
                c.arc(0, 0, this.r, 0, 2 * Math.PI, true);
                c.stroke();

                c.restore();
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
        var rackets = []
        rackets.push(new Racket({
            x: 2,
            y: (HEIGHT - racketHeight) / 2,
            width: racketWidth,
            height: racketHeight * 4.8,
            yMin: yMin,
            yMax: yMax,
            up: key(87),  // w
            down: key(83)  // s
        }));

        // create right racket
        rackets.push(new Racket({
            x: WIDTH - racketWidth - 2,
            y: (HEIGHT - racketHeight) / 2,
            width: racketWidth,
            height: racketHeight * 4.8,
            yMin: yMin,
            yMax: yMax,
            up: key(38),  // up arrow
            down: key(40)  // down arrow
        }));

        // create middle racket
        rackets.push(new Racket({
            x: WIDTH / 2,
            y: (HEIGHT - racketHeight) / 2,
            width: racketWidth,
            height: racketHeight,
            yMin: yMin,
            yMax: yMax,
            up: key(38),  // up arrow
            down: key(40)  // down arrow
        }));

        // create balls
        var balls = [];
        balls.push(new Ball({
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

        balls.push(new Ball({
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

        balls.push(new Ball({
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

        // draw rackets
        setInterval(function() {
            // clear everything apart borders
            c.clearRect(0, borderThickness,
                        WIDTH, HEIGHT - 2 * borderThickness);

            // draw rackets
            for (var i = 0; i < rackets.length; i++) {
                rackets[i].draw();
            }

            // draw balls
            for (var i = 0; i < balls.length; i++) {
                balls[i].draw();
            }
        }, 1000 / FPS);
    }
}

main();
