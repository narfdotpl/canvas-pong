// require pong
var pong; if (!pong) throw new Error('pong module has not been loaded');


pong.ControlsScreen = function (c, WIDTH, HEIGHT) {
    // set dimensions
    this.width = WIDTH * 0.85;
    this.height = HEIGHT * 0.3;
    this.x = (WIDTH - this.width) / 2;
    this.y = (HEIGHT - this.height) / 2;

    // create new canvas for controls screen layer
    this.canvas = $('<canvas id="pong-controls-screen" ' +
                    'width="' + this.width + '" ' +
                    'height="' + this.height + '">').
                  appendTo('body').hide()[0];
    this.c = this.canvas.getContext('2d');

    // set initial visibility values
    this.fadedIn = false;
    this.fadedOut = true;
    this.alpha = 0;

    // draw layer
    this.draw = function () {
        c.save();
        c.globalAlpha = this.alpha;
        c.drawImage(this.canvas, this.x, this.y);
        c.restore();
    };

    // fade in
    this.fadeIn = function () {
        this.fadedIn = false;
        this.fadedOut = false;

        this.alpha += 0.1;
        if (this.alpha >= 1) {
            this.alpha = 1;
            this.fadedIn = true;
        }

        this.draw();
    };

    // fade out
    this.fadeOut = function () {
        this.fadedIn = false;
        this.fadedOut = false;

        this.alpha -= 0.075;
        if (this.alpha <= 0) {
            this.alpha = 0;
            this.fadedOut = true;
        }

        this.draw();
    };


    //-------------------------------
    //  draw actual controls screen
    //-------------------------------

    // create handy variables
    var x, y, w, h;

    // draw background
    this.c.fillStyle = 'rgba(255, 255, 255, 0.85)';
    this.c.fillRect(0, 0, this.width, this.height);

    // setup text style
    this.c.font = '12px "Lucida Grande", Lucida, Arial, sans-serif';
    this.c.fillStyle = '#000';
    this.c.textBaseline = 'top';

    // draw play icon
    w = 30;
    h = 30;
    x = this.width / 2 - (w + 10);
    y = (this.height - h) / 2;
    this.c.beginPath();
    this.c.moveTo(x, y);
    this.c.lineTo(x, y + h);
    this.c.lineTo(x + w, y + h / 2);
    this.c.closePath();
    this.c.stroke();

    // draw slash between play and pause icons
    this.c.beginPath();
    this.c.moveTo(x + w, y + h);
    x += w + 10;
    this.c.lineTo(x, y);
    this.c.stroke();

    // write key name
    var textY = y + h + 2;
    this.c.fillText('space', x - 20, textY);

    // draw pause icon
    x += 5;
    w = 9;
    this.c.beginPath();
    this.c.rect(x, y, w, h);
    x += w * 1.8;
    this.c.rect(x, y, w, h);
    this.c.stroke();

    // draw arrows
    function drawArrows(c, x, y, w, h) {
        // left
        c.beginPath();
        c.moveTo(x, y + h);
        c.lineTo(x + w / 2, y);
        c.lineTo(x + w, y + h);
        c.closePath();
        c.stroke();

        // right
        x += w * 0.8;
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x + w / 2, y + h);
        c.lineTo(x + w, y);
        c.closePath();
        c.stroke();
    }

    // draw left arrows
    w = 30;
    x = w;
    drawArrows(this.c, x, y, w, h);

    // write key names
    this.c.fillText('w/s', x + w * 0.8 - 8, textY);

    // draw right arrows
    x = this.width - 2.8 * w;
    drawArrows(this.c, x, y, w, h);

    // write key names
    this.c.fillText('up/down arrow', x + w * 0.8 - 44, textY);
};
