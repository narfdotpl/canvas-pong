// require pong
var pong; if (!pong) throw new Error('pong module has not been loaded');


pong.Border = function (c, kwargs) {
    // x, y, width, height
    for (var k in kwargs) {
        this[k] = kwargs[k];
    }

    this.draw = function () {
        c.save();
        c.fillStyle = '#000';
        c.fillRect(this.x, this.y, this.width, this.height);
        c.restore();
    };
};
