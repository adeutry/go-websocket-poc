var state;
var balls;

function main() {

    var canvas = document.getElementById('canvas');

    function drawCanvas() {
        var widthScale  = 1.0;
        var heightScale = 1.0;
        canvas.width  = window.innerWidth * widthScale;
        canvas.height = window.innerHeight * heightScale;

        window.requestAnimationFrame(draw);
    }

    // initalize some balls
    var numBalls = 20;
    balls = Array(numBalls);
    for(var i = 0; i<numBalls; i++) {
        balls[i] = {
            x : getRndFlt(40, canvas.width - 40),
            y : getRndFlt(40, canvas.height - 40),
            vx : getRndFlt(-3, 3),
            vy : getRndFlt(-3, 3),
            r : getRndFlt(30, 60)}
    }

    // initialize canvas size
    drawCanvas();
    window.addEventListener('resize', drawCanvas, false);

}

function toRadians(angle) { return (Math.PI/180) * angle; }

function draw() {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgb(200, 0, 0)';
    ctx.fillRect(10, 10, 50, 50);

    ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
    ctx.fillRect(30, 30, 50, 50);

    ctx.fill();

    for(let ball of balls) {
        updateBall(ball);
        drawBall(ball, ctx);
    }

    window.requestAnimationFrame(draw);
}

function getRndFlt(min, max) {
      return Math.random() * (max - min) + min;
}

function drawBall(ball, ctx) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, toRadians(360), false);
    ctx.closePath();
    ctx.fill();
}

function updateBall(ball) {
    ball.x += ball.vx;
    ball.y += ball.vy;
    var inHBound = (ball.x + ball.r) < canvas.width  && (ball.x - ball.r) > 0;
    var inYBound = (ball.y + ball.r) < canvas.height && (ball.y - ball.r) > 0;
    if (!inHBound) { ball.vx = -ball.vx };
    if (!inYBound) { ball.vy = -ball.vy };
}

// only run main if canvas is supported
var canvas = document.getElementById('canvas');
if (canvas.getContext) {
    main();
} else {
    console.log("Oops! Your browser does not support canvas. Sorry :(")
}
