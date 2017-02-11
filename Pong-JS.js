// canvas
var canvas;
var canvasContext;

// settings
const DESIRED_UPS = 60;

// ball
var bSize;
var bX;
var bY;
var bSpeedX;
var bSpeedY;

// player default
var pHorizontalOffset;

var pWidth;
var pHeight;

// player 1
var p1X;
var p1Y;

var p1Score;

// player 2
var p2X;
var p2Y;
var p2Speed;

var p2Score;

// initial call when page finished loading
window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	canvas.addEventListener('mousemove', function(evt) {
		var mousePos = calcMousePos(evt);
		p1Y = mousePos.y - (pHeight / 2);
	}, false);

	newGame();

	setInterval(function() {
		tick();
		draw();
	}, (1000 / DESIRED_UPS));
}

// starts fresh game
function newGame () {
	// ball
	bSize = 10;
	
	// player default
	pHorizontalOffset = 20;

	pWidth = 10;
	pHeight = 70;

	// player 1
	p1X = 0 + pHorizontalOffset;
	p1Y = (canvas.height / 2) - (pHeight / 2);

	p1Score = 0;

	// player 2
	p2X = canvas.width - pHorizontalOffset - pWidth;
	p2Y = (canvas.height / 2) - (pHeight / 2);
	p2Speed = 1.7;

	p2Score = 0;

	// ready
	reset();
}

// resets game data after every point won/lost
function reset () {
	// ball
	bX = (canvas.width / 2) - (bSize / 2);
	bY = getRandInt(20, canvas.height - 20);
	bSpeedX = 2 * ((getRandInt(0,1) == 0)? -1 : 1);
	bSpeedY = 2 * ((getRandInt(0,1) == 0)? -1 : 1);
}

// updates all game data
function tick () {
	// ball
	ballMovement();

	p1Movement();

	// player 2
	p2Movement();
}

// renders to the canvas
function draw () {
	canvasContext.fillStyle = 'black';
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);

	canvasContext.fillStyle = 'white';

	// net
	var dashWidth = 3;
	var dashHeight = 25;

	for (i=0; i<11; i++) {
		canvasContext.fillRect((canvas.width / 2) - (dashWidth / 2), 2 * (dashHeight * i) + (1.5 * dashHeight), dashWidth, dashHeight);
	}
	
	// ball
	canvasContext.fillRect(bX, bY, bSize, bSize);

	// player 1
	canvasContext.fillRect(p1X, p1Y, pWidth, pHeight);

	// player 2
	canvasContext.fillRect(p2X, p2Y, pWidth, pHeight);
}

// game object collisions

function ballMovement () {
	// vertical collisions
	for (i=0; i<Math.abs(bSpeedY); i++) {
		// up
		if (bSpeedY < 0) {
			var ceilingCollision = collideUp(bY, 0, 1);

			if (ceilingCollision) {
				bSpeedY *= -1;
			}
		}

		// down
		if (bSpeedY > 0) {			
			var floorCollision = collideDown(bY + bSize, canvas.height, 1);

			if (floorCollision) {
				bSpeedY *= -1;
			}
		}

		bY += bSpeedY;
	}

	// horizontal collisions
	for (i=0; i<Math.abs(bSpeedX); i++) {
		// left
		if (bSpeedX < 0) {
			var leftWallCollision = collideLeft(bX, 0, 1);

			if (leftWallCollision) {
				p2Score++;
	
				reset();
			}
		}

		// right
		if (bSpeedX > 0) {
			var rightWallCollision = collideRight(bX + bSize, canvas.width, 1);

			if (rightWallCollision) {
				p1Score++;

				reset();
			}
		}
		
		bX += bSpeedX;
	}
}

function p1Movement () {
	if (p1Y < 0) {
		p1Y = 0;
	}

	if (p1Y + pHeight > canvas.height) {
		p1Y = canvas.height - pHeight;
	}
}

function p2Movement () {
	var bVerticalCenter = bY + (bSize / 2);
	var p2VerticalCenter = p2Y + (pHeight / 2);

	// up
	if (bVerticalCenter < p2VerticalCenter) {
		for (i=0; i<Math.abs(p2Speed); i++) {
			var ceilingCollision = collideUp(p2Y, 0, 1);

			if (!ceilingCollision) {
				p2Y -= p2Speed;
			}
		}
	}

	// down
	if (bVerticalCenter > p2VerticalCenter) {
		for (i=0; i<Math.abs(p2Speed); i++) {
			var floorCollision = collideDown(p2Y + pHeight, canvas.height, 1);

			if (!floorCollision) {
				p2Y += p2Speed;
			}
		}
	}
}

// general collision detection

function collideUp (mainTop, colliderBottom, step) {
	step = Math.abs(step);

	if (mainTop - step < colliderBottom) {
		return true;
	}

	return false;
}

function collideDown (mainBottom, colliderTop, step) {
	step = Math.abs(step);

	if (mainBottom + step > colliderTop) {
		return true;
	}

	return false;
}

function collideLeft (mainLeft, colliderRight, step) {
	step = Math.abs(step);

	if (mainLeft - step < colliderRight) {
		return true;
	}

	return false;
}

function collideRight (mainRight, colliderLeft, step) {
	step = Math.abs(step);

	if (mainRight + step > colliderLeft) {
		return true;
	}

	return false;
}

// other useful functions

function getRandInt (min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);

	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calcMousePos (evt) {
	var rect = canvas.getBoundingClientRect();
	
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}
