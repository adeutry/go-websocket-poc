var ballX = 0;
var ballY = 0;

var socket = new WebSocket("ws://localhost:8085/helloWebsocket");

socket.onopen = function(event) {
    var msg = JSON.stringify({
        type : 1,
        message : "Hello, server!"
    });
    socket.send(msg);
}

socket.onmessage = function(event) {
    console.log("got message:" + event.data);
    var msg = JSON.parse(event.data);

    switch (msg['type']) {
        case 1:
            console.log("received plain text message: " + msg['message']);
        break;
        case 2:
            console.log("received ball pos message: " + msg['message']);
            ballX = msg['ballX']
            ballY = msg['ballY']
        default: 
            console.log("invalid message type");
    }
}

function main() {
    
    var canvas = document.getElementById('canvas');

    function drawCanvas() {
        var widthScale  = 1.0;
        var heightScale = 1.0;
        canvas.width  = window.innerWidth * widthScale;
        canvas.height = window.innerHeight * heightScale;

        window.requestAnimationFrame(draw);
    }

    // initialize canvas size
    drawCanvas();
    window.addEventListener('resize', drawCanvas, false);

}

function draw() {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, toRadians(360), false);
    ctx.closePath();
    ctx.fill();

    window.requestAnimationFrame(draw);
}

// only run main if canvas is supported
var canvas = document.getElementById('canvas');
if (canvas.getContext) {
    main();
} else {
    console.log("Oops! Your browser does not support canvas. Sorry :(")
}