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

    this.hitShuttlecock = function (shuttlecock) {
        // see my-stuff/docs/shuttlecock.jpg

        var hit = false,
            P = shuttlecock.cork.previousPosition.x,
            C = shuttlecock.cork.currentPosition.x;

        if (shuttlecock.cork.movingLeft) {
            var R = this.x + this.width;
            if (C <= R && R < P) {
                var low = this.y,
                    high = this.y + this.height,
                    y = shuttlecock.cork.getYBetweenPositions(R);
                if (low <= y && y <= high) {
                    hit = true;
                    shuttlecock.vx = Math.abs(shuttlecock.vx);
                    shuttlecock.angle.update();
                    shuttlecock.moveTo(shuttlecock.x + R - C, shuttlecock.y);
                }
            }
        } else {
            var L = this.x;
            if (P < L && L <= C) {
                var low = this.y,
                    high = this.y + this.height,
                    y = shuttlecock.cork.getYBetweenPositions(L);
                if (low <= y && y <= high) {
                    hit = true;
                    shuttlecock.vx = -Math.abs(shuttlecock.vx);
                    shuttlecock.angle.update();
                    shuttlecock.moveTo(shuttlecock.x - C + L, shuttlecock.y);
                }
            }
        }

        if (hit) {
            shuttlecock.vy += 0.2 * this.v;
            shuttlecock.vx *= 1.02;
        }
        return hit;
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
