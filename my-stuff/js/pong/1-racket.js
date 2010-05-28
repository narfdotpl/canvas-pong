// require pong
var pong; if (!pong) throw new Error('pong module has not been loaded');


pong.Racket = function (c, kwargs) {
    // x, y, width, height, acceleration, up(), down(), limits (v max,
    // y min/max)
    for (var k in kwargs) {
        this[k] = kwargs[k];
    }

    this.limits.y.max -= this.height;
    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;
    this.v = 0;

    this.applyPositionAndSpeedConstraints = function () {
        // don't cross borders
        if (this.y < this.limits.y.min) {
            this.y = this.limits.y.min;
            this.v = 0;
        } else if (this.y > this.limits.y.max) {
            this.y = this.limits.y.max;
            this.v = 0;
        }

        // limit speed
        if (Math.abs(this.v) > this.limits.v.max) {
            var sign = this.v > 0 ? 1 : -1;
            this.v = sign * this.limits.v.max;
        }
    };
    this.applyPositionAndSpeedConstraints();

    this.draw = function () {
        c.beginPath();
        c.rect(this.x, this.y, this.width, this.height);
        c.stroke();
    };

    this.hitBall = function (ball) {
        // treat ball like square inscribed in circle of ball.r radius

        // compute center distances
        var xDist = ball.x - (this.x + this.halfWidth),
            xDistAbs = Math.abs(xDist),
            yDist = ball.y - (this.y + this.halfHeight),
            yDistAbs = Math.abs(yDist);

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

    this.move = function () {
        this.y += this.v;

        // react to keyboard input
        if (this.up()) {
            if (this.v > 0) {
                this.v = 0;
            }
            this.v -= this.acceleration;
        } else if (this.down()) {
            if (this.v < 0) {
                this.v = 0;
            }
            this.v += this.acceleration;
        } else {
            this.v = 0;
        }

        this.applyPositionAndSpeedConstraints();
    };
};
