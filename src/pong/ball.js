// require pong
var pong; if (!pong) throw new Error('pong module has not been loaded');


pong.Ball = function(c, kwargs) {
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
};
