// require pong
var pong; if (!pong) throw new Error('pong module has not been loaded');


pong.Angle = function (shuttlecock) {
    this.setRad = function (rad) {
        if (rad !== this.rad) {
            this.rad = rad;
            this.cos = Math.cos(rad);
            this.sin = Math.sin(rad);
        }
    };
    this.setRad(0);

    this.update = function () {
        var x = shuttlecock.vx,
            y = shuttlecock.vy;
        this.setRad(Math.atan(y / x) + (x > 0 ? Math.PI : 0));
    };
};


pong.Cork = function (shuttlecock) {
    this.previousPosition = {};
    this.currentPosition = {};

    this.getYBetweenPositions = function (x) {
        // y = a * x + b
        var p = this.previousPosition,
            c = this.currentPosition,
            a = (c.y - p.y) / (c.x - p.x),
            b = p.y - a * p.x;
        return a * x + b;
    };

    this.saveCurrentPosition = function () {
        var p = this.previousPosition,
            c = this.currentPosition;
        p.x = c.x;
        p.y = c.y;
    };

    this.updateCurrentPosition = function (omitXUpdate) {
        var cp = this.currentPosition,
            s = shuttlecock;

        // update y
        cp.y = s.y - s.halfLength * s.angle.sin;

        // update x
        if (!omitXUpdate) {
            // moving left?
            var newX = s.x - s.halfLength * s.angle.cos;
            this.movingLeft = cp.x - newX > 0;

            cp.x = newX;
        }
    };
};


pong.Shuttlecock = function (c, kwargs) {
    // x, y, length, vx, vy, rackets, endGameCallback,
    // limits (x min/max, y min/max, vx max, vy max)
    for (var k in kwargs) {
        this[k] = kwargs[k];
    }

    this.angle = new pong.Angle(this);
    this.cork = new pong.Cork(this);
    this.halfLength = this.length / 2;
    this.halfWidth = this.halfLength * 0.7;
    this.limits.v2 = {max: this.limits.vx.max * this.limits.vy.max};

    this.applyPositionAndSpeedConstraints = function () {
        // bounce from borders
        var ccp = this.cork.currentPosition;
        if (ccp.y < this.limits.y.min) {
            this.vy = Math.abs(this.vy);
            this.angle.update();
            this.moveTo(this.x, 2 * this.limits.y.min - ccp.y +
                                this.halfLength * this.angle.sin, true);
        } else if (ccp.y > this.limits.y.max) {
            this.vy = -Math.abs(this.vy);
            this.angle.update();
            this.moveTo(this.x, 2 * this.limits.y.max - ccp.y +
                                this.halfLength * this.angle.sin, true);
        }

        // bounce from rackets
        for (var i = 0; i < this.rackets.length; i++) {
            if (this.rackets[i].hitShuttlecock(this)) {
                break;
            }
        }

        // limit speed
        var sign;
        if (Math.abs(this.vx) > this.limits.vx.max) {
            sign = this.vx > 0 ? 1 : -1;
            this.vx = sign * this.limits.vx.max;
        }
        if (Math.abs(this.vy) > this.limits.vy.max) {
            sign = this.vy > 0 ? 1 : -1;
            this.vy = sign * this.limits.vy.max;
        }

        // update angle
        this.angle.update();

        // end game
        var x = this.cork.currentPosition.x;
        if (x < this.limits.x.min || x > this.limits.x.max) {
            this.endGameCallback();
        }
    };
    this.applyPositionAndSpeedConstraints();

    this.draw = function () {
        // draw triangle
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.angle.rad);
        c.beginPath();
        c.moveTo(-this.halfLength, 0);
        c.lineTo(this.halfLength, this.halfWidth);
        c.lineTo(this.halfLength, -this.halfWidth);
        c.closePath();
        c.stroke();
        c.restore();
    };

    this.move = function () {
        this.cork.saveCurrentPosition();
        this.moveTo(this.x + this.vx, this.y + this.vy);
        this.applyPositionAndSpeedConstraints();
    };

    this.moveTo = function (x, y, omitCorkXUpdate) {
        // update center position
        this.x = x;
        this.y = y;

        // update cork position
        this.cork.updateCurrentPosition(omitCorkXUpdate);
    };
};
