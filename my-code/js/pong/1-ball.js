// require pong
var pong; if (!pong) throw new Error('pong module has not been loaded');


pong.Ball = function (c, kwargs) {
    // x, y, r, vx, vy, xMin, xMax, yMin, yMax, maxSpeed, maxStretch, rackets,
    // endGameCallback
    for (var k in kwargs) {
        this[k] = kwargs[k];
    }

    this.xMin += this.r;
    this.xMax -= this.r;
    this.yMin += this.r;
    this.yMax -= this.r;
    this.halfSide = this.r / Math.sqrt(2);  // for racket collision

    this.draw = function () {
        // stretch circle
        var speedRatio = (this.vx * this.vx + this.vy * this.vy) /
                         (this.maxSpeed * this.maxSpeed),
            scaleX = 1 + speedRatio * (this.maxStretch - 1);
        if (scaleX > this.maxStretch) {
            scaleX = this.maxStretch;
        }
        var scaleY = 1 / scaleX;

        // rotate circle
        var angle = Math.atan(this.vy / this.vx),
            cos = Math.cos(angle),
            sin = Math.sin(angle);

        // draw ellipse
        c.save();
        c.transform(scaleX * cos, sin, -sin, scaleY * cos, this.x, this.y);
        c.beginPath();
        c.arc(0, 0, this.r, 0, 2 * Math.PI, true);
        c.stroke();
        c.restore();
    };

    this.move = function (omitCallback) {
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

        // end game
        if (!omitCallback) {
            if (this.x < this.xMin || this.x > this.xMax) {
                this.endGameCallback();
            }
        }
    };
};
