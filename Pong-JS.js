// canvas
var canvas;
var canvasContext;

// settings
var desired_ups;

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

// player 2
var p2X;
var p2Y;

// initial call when page finished loading
window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	reset();
	
	setInterval(function() {
		tick();
		draw();
	}, 1000 / desired_ups);

	tick();
	draw();
}

// resets game data
function reset () {
	// settings
	desired_ups = 30;

	// ball
	bSize = 10;
	bX = (canvas.width / 2) - (bSize / 2);
	bY = (canvas.height / 2) - (bSize / 2);
	bSpeedX = 2;
	bSpeedY = 2;

	// player default
	pHorizontalOffset = 20;

	pWidth = 10;
	pHeight = 70;

	// player 1
	p1X = 0 + pHorizontalOffset;
	p1Y = (canvas.height / 2) - (pHeight / 2);

	// player 2
	p2X = canvas.width - pHorizontalOffset;
	p2Y = p1Y;
}

// updates all game data
function tick () {
	// ball
	ballMovement();
}

// renders to the canvas
function draw () {
	canvasContext.fillStyle = 'black';
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);

	canvasContext.fillStyle = 'white';
	
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
	for (i=0; i<bSpeedY; i++) {
		// up
		var ceilingCollision = collideUp(bY, 0, 1);
		
		if (ceilingCollision) {
			//bSpeedY *= -1;
		}

		// down
		var floorCollision = collideDown(bY + bSize, canvas.height, 1);

		if (floorCollision) {
			//bSpeedY *= -1;
		}

		bY += bSpeedY;
	}

	// horizontal collisions
	for (i=0; i<bSpeedX; i++) {
		// left
		var leftWallCollision = collideLeft(bX, 0, 1);

		if (leftWallCollision) {
			bSpeedX *= -1;
		}

		// right
		var rightWallCollision = collideRight(bX + bSize, canvas.width, 1);

		if (rightWallCollision) {
			bSpeedX *= -1;
		}

		bX += bSpeedX;
	}
}

// general collision detection

function collideUp (mainTop, colliderBottom, step) {
	if (mainTop - step <= colliderBottom) {
		return true;
	}

	return false;
}

function collideDown (mainBottom, colliderTop, step) {
	if (mainBottom + step <= colliderTop) {
		return true;
	}

	return false;
}

function collideLeft (mainLeft, colliderRight, step) {
	if (mainLeft - step <= colliderRight) {
		return true;
	}

	return false;
}

function collideRight (mainRight, colliderLeft, step) {
	if (mainRight + step >= colliderLeft) {
		return true;
	}

	return false;
}
