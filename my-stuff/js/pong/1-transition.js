// require pong
var pong; if (!pong) throw new Error('pong module has not been loaded');


pong.Transition = function () {
    this.done = true;
    this.progress = 1;  // 0..1

    this.getCurrentGameAlpha = function () {
        return this.progress;
    };

    this.getPreviousGameAlpha = function () {
        return 1 - this.progress;
    };

    this.process = function () {
        this.progress += 1 / 60;
        if (this.progress >= 1) {
            this.progress = 1;
            this.done = true;
        }
    };

    this.start = function () {
        this.progress = 0;
        this.done = false;
    };
};
