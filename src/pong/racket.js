// require pong
var pong; if (!pong) throw new Error('pong module has not been loaded');


pong.Racket = function(c, kwargs) {
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
};
