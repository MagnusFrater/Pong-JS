// canvas
var canvas;
var canvasContext;

// settings
const DESIRED_UPS = 60;

var gameState;
const WIN_AMOUNT = 10;

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

		p1Movement(mousePos);
	}, false);

	canvas.addEventListener('mousedown', handleMouseDown);

	setInterval(function() {
		tick();
		draw();
	}, (1000 / DESIRED_UPS));

	// settings
	gameState = "TITLE";
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
	p2Speed = 5;

	p2Score = 0;

	// ready
	resetBall();

	// settings
	gameState = "INGAME";
}

// resets ball
function resetBall () {
	// settings
	if (p1Score >= WIN_AMOUNT || p2Score >= WIN_AMOUNT) {
		gameState = "GAMEOVER";
	}

	// ball
	bX = (canvas.width / 2) - (bSize / 2);
	bY = getRandInt(20, canvas.height - 20);
	bSpeedX = 5 * ((getRandInt(0,1) == 0)? -1 : 1);
	bSpeedY = 5 * ((getRandInt(0,1) == 0)? -1 : 1);
}

// updates all game data
function tick () {
	if (gameState.valueOf() == "INGAME") {
		// ball
		ballMovement();

		// player 2
		p2Movement();
	}
}

// renders to the canvas
function draw () {
	canvasContext.fillStyle = 'black';
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);
	
	canvasContext.fillStyle = 'white';
	
	// TESTING
	//canvasContext.fillRect(canvas.width / 2, 0, 1, canvas.height);
	//canvasContext.fillRect(0, canvas.height / 2, canvas.width, 1);
	// TESTING

	if (gameState.valueOf() == "TITLE") {
		canvasContext.font = "150px Verdana";
		canvasContext.fillText("PONG", (canvas.width / 5) + 30, (canvas.height / 5 * 2));

		canvasContext.fillRect(250, 275, canvas.width - 500, 10);

		canvasContext.font = "70px Verdana";
		canvasContext.fillText("PLAY", (canvas.width / 3) + 50, (canvas.height * (4/5)));
	}

	if (gameState.valueOf() == "INGAME") {
		
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

		canvasContext.font = "70px Verdana";
		canvasContext.fillText(p1Score, 180, 80);

		// player 2
		canvasContext.fillRect(p2X, p2Y, pWidth, pHeight);

		canvasContext.font = "70px Verdana";
		canvasContext.fillText(p2Score, canvas.width - 220, 80);
	}

	if (gameState.valueOf() == "GAMEOVER") {
		canvasContext.font = "75px Verdana";
		
		if (p1Score > p2Score) {
			canvasContext.fillText("P1 WINS!", 100, 200);
		} else {
			canvasContext.fillText("P2 WINS!", 100, 200);
		}

		canvasContext.fillText("CONTINUE", (canvas.width / 2) - 100, (canvas.height * (4/5)));
	}
}

// triggered when mouse is clicked
function handleMouseDown (evt) {
	if (gameState.valueOf() == "TITLE") {
		newGame();
	}

	if (gameState.valueOf() == "GAMEOVER") {
		gameState = "TITLE";
	}
}

// game object collisions/movement

function ballMovement () {
	// vertical collisions
	for (i=0; i<Math.abs(bSpeedY); i++) {
		// up
		if (bSpeedY < 0) {
			// ball-p1_bottom collision
			
			// check if ball shares at least 1 column of pixels with p1
			var ballWithinP1Bounds = ((bX >= p1X) && (bX <= p1X + pWidth)) || ((bX + bSize <= p1X + pWidth) && (bX + bSize >= p1X));
			
			// check for ball-p1 collision 1 step in the future
			var p1Collision = collideUp(bY, p1Y + pHeight, 1) && ballWithinP1Bounds;

			// don't act on collision if ball isn't below p1
			var ballBelowP1 = (bY >= p1Y + pHeight);
			
			if (p1Collision && ballBelowP1) {
				bSpeedY *= -1;

				break;
			}

			// ball-p2_bottom collision

			// check if ball shares at least 1 column of pixels with p2
			var ballWithinP2Bounds = ((bX >= p2X) && (bX <= p2X + pWidth)) || ((bX + bSize <= p2X + pWidth) && (bX + bSize >= p2X));

			// check for ball-p2 collision 1 step in the future
			var p2Collision = collideUp(bY, p2Y + pHeight, 1) && ballWithinP2Bounds;

			// don't act on collision if ball isn't below p2
			var ballBelowP2 = (bY >= p2Y + pHeight);

			if (p2Collision && ballBelowP2) {
				bSpeedY *= -1;

				break;
			}

			// check for ball-ceiling collision 1 step in the future
			var ceilingCollision = collideUp(bY, 0, 1);

			if (ceilingCollision) {
				bSpeedY *= -1;

				break;
			}
		}

		// down
		if (bSpeedY > 0) {
			// ball-p1_top collision

			// check if ball shares at least 1 column of pixels with p1
			var ballWithinP1Bounds = ((bX >= p1X) && (bX <= p1X + pWidth)) || ((bX + bSize <= p1X + pWidth) && (bX + bSize >= p1X));

			// check for ball-p1 collision 1 step in the future
			var p1Collision = collideDown(bY + bSize, p1Y, 1) && ballWithinP1Bounds;

			// don't act on collision if ball isn't above p1
			var ballAboveP1 = (bY + bSize <= p1Y);

			if (p1Collision && ballAboveP1) {
				bSpeedY *= -1;

				break;
			}

			// ball-p2_top collision

			// check if ball shares at least 1 column of pixels with p2
			var ballWithinP2Bounds = ((bX >= p2X) && (bX <= p2X + pWidth)) || ((bX + bSize <= p2X + pWidth) && (bX + bSize >= p2X));

			// check for ball-p2 collision 1 step in the future
			var p2Collision = collideDown(bY + bSize, p2Y, 1) && ballWithinP2Bounds;

			// don't act on collision if ball isn't above p2
			var ballAboveP2 = (bY + bSize <= p2Y);

			if (p2Collision && ballAboveP2) {
				bSpeedY *= -1;

				break;
			}

			// check for ball-floor collision 1 step in the future
			var floorCollision = collideDown(bY + bSize, canvas.height, 1);

			if (floorCollision) {
				bSpeedY *= -1;

				break;
			}
		}
		
		if (bSpeedY > 0) {
			bY += 1;
		} else {
			bY -= 1;
		}
	}

	// horizontal collisions
	for (i=0; i<Math.abs(bSpeedX); i++) {
		// left
		if (bSpeedX < 0) {
			// check if ball shares at least 1 row of pixels with p1
			var ballWithinP1Bounds = ((bY >= p1Y) && (bY <= p1Y + pHeight)) || ((bY + bSize <= p1Y + pHeight) && (bY + bSize >= p1Y));
			
			// check for ball-p1 collision 1 step in the future
			var p1Collision = collideLeft(bX, p1X + pWidth, 1) && ballWithinP1Bounds;
			
			// don't act on collision if the left of the ball is past the right of p1
			var ballLeftPastP1Right = (bX < p1X + pWidth);

			if (p1Collision && !ballLeftPastP1Right) {
				bSpeedX *= -1;

				var deltaY = bY - (p1Y + (pHeight / 2));
				bSpeedY = deltaY * 0.27;

				break;
			}
			
			// check for ball-left_wall collision 1 step in the future
			var leftWallCollision = collideLeft(bX + bSize, 0, 1);

			if (leftWallCollision) {
				p2Score++;
	
				resetBall();

				break;
			}
		}

		// right
		if (bSpeedX > 0) {
			// check if ball shares at least 1 row of pixels with p2
			var ballWithinP2Bounds = ((bY >= p2Y) && (bY <= p2Y + pHeight)) || ((bY + bSize <= p2Y + pHeight) && (bY + bSize >= p2Y));
			
			// check for ball-p2 collision 1 step in the future
			var p2Collision = collideRight(bX + bSize, p2X, 1) && ballWithinP2Bounds;

			// don't act on collision if the right of the ball is past the left of p2
			var ballRightPastP2Left = (bX + bSize > p2X);

			if (p2Collision && !ballRightPastP2Left) {
				bSpeedX *= -1;

				var deltaY = bY - (p2Y + (pHeight / 2));
				bSpeed = deltaY * 0.27;
	
				break;
			}

			// check for ball-right_wall collision 1 step in the future
			var rightWallCollision = collideRight(bX, canvas.width, 1);

			if (rightWallCollision) {
				p1Score++;

				resetBall();

				break;
			}
		}
		
		if (bSpeedX > 0) {
			bX += 1;
		} else {
			bX -= 1;
		}
	}
}

function p1Movement (mousePos) {
	p1Y = mousePos.y - (pHeight / 2);
	
	// p1 should never be above ceiling
	if (p1Y < 0) {
		p1Y = 0;
	}
	
	// p1 should never be below floor
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
			// check for p2-ceiling collision 1 step in the future
			var ceilingCollision = collideUp(p2Y, 0, 1);

			if (!ceilingCollision) {
				p2Y -= 1;
			} else {
				break;
			}

			// stop moving up if center is past ball_center
			bVerticalCenter = bY + (bSize / 2);
			p2VerticalCenter = p2Y + (pHeight / 2);

			if (p2VerticalCenter <= bVerticalCenter) {
				break;
			}
		}
	}

	// down
	if (bVerticalCenter > p2VerticalCenter) {
		for (i=0; i<Math.abs(p2Speed); i++) {
			// check for p2-floor collision 1 step in the future
			var floorCollision = collideDown(p2Y + pHeight, canvas.height, 1);

			if (!floorCollision) {
				p2Y += 1;
			} else {
				break;
			}

			// stop moving down if center is past ball_center
			bVerticalCenter = bY + (bSize / 2);
			p2VerticalCenter = p2Y + (pHeight / 2);

			if (p2VerticalCenter >= bVerticalCenter) {
				break;
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
