// require pong
var pong; if (!pong) throw new Error('pong module has not been loaded');


pong.Ball = function (c, kwargs) {
    // x, y, r, vx, vy, rackets, endGameCallback, limits (x min/max, y min/max,
    // vx max, vy max, stretch max)
    for (var k in kwargs) {
        this[k] = kwargs[k];
    }

    this.limits.v2 = {max: this.limits.vx.max * this.limits.vy.max};
    this.limits.x.min += this.r;
    this.limits.x.max -= this.r;
    this.limits.y.min += this.r;
    this.limits.y.max -= this.r;
    this.halfSide = this.r / Math.sqrt(2);  // for racket collision

    this.applyPositionAndSpeedConstraints = function () {
        // bounce from borders
        if (this.y < this.limits.y.min) {
            this.y = this.limits.y.min;
            this.vy = Math.abs(this.vy);
        } else if (this.y > this.limits.y.max) {
            this.y = this.limits.y.max;
            this.vy = - Math.abs(this.vy);
        } else {
            // bounce from rackets
            for (var i = 0; i < this.rackets.length; i++) {
                if (this.rackets[i].hitBall(this)) {
                    break;
                }
            }
        }

        // limit speed
        if (Math.abs(this.vx) > this.limits.vx.max) {
            var sign = this.vx > 0 ? 1 : -1;
            this.vx = sign * this.limits.vx.max;
        }
        if (Math.abs(this.vy) > this.limits.vy.max) {
            var sign = this.vy > 0 ? 1 : -1;
            this.vy = sign * this.limits.vy.max;
        }
    };
    this.applyPositionAndSpeedConstraints();

    this.draw = function () {
        // stretch circle
        var speedRatio = (this.vx * this.vx + this.vy * this.vy) /
                         this.limits.v2.max;
            scaleX = 1 + speedRatio * (this.limits.stretch.max - 1);
        if (scaleX > this.limits.stretch.max) {
            scaleX = this.limits.stretch.max;
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

        this.applyPositionAndSpeedConstraints();

        // end game
        if (!omitCallback) {
            if (this.x < this.limits.x.min || this.x > this.limits.x.max) {
                this.endGameCallback();
            }
        }
    };
};
