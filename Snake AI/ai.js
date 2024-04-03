// Global Variables
var gameIntervalDurationArray = []; // Interval Array
var framesPerSecond = 30; // Frames Per Second
var SpeedOfSnake = 5; // Snake Speed
var xAxisFoodPosition; // Food Position in X Axis
var yAxisFoodPosition; // Food Position in Y Axis
var eatFood = true; 
var gameOver;
var game = document.getElementById('game'); // game Menu
var startButton = document.getElementById('startButton'); // Start Button
var PauseButton = document.getElementById('PauseButton'); // Pause Button
var firstButton = document.getElementById('firstButton'); // Continue Button
var secondButton = document.getElementById('secondButton'); // Restart Button
var startPopUp = document.getElementById('startPopUp'); // Start Menu
var message = document.getElementById('message'); // Lose Message
var gameoverPopUp = document.getElementById('gameoverPopUp'); // Game Over Menu
var tryagainButton = document.getElementById('tryagainButton'); // Try Again Button
var gameIsInProgress = false; // Save Game Situation
var gameIsPaused = false; // Save Game Situation

// When Blur Is Active Then Pause Game
onblur = function () {
	if (gameIsInProgress == true) 
	{
	  gamePause();
	}
  };

// Set Class Names
gameoverPopUp.className = '';
pausePopUp.className = '';
game.className = '';
startPopUp.className = "on";

// Create Canvas
var canvas = document.getElementById("gameCanvas");
var canvasDimension = canvas.getContext("2d");

// Snake Constructor
function Snake(lengthOfSnake, xAxisSnake, yAxisSnake, directionOfSnake, colorOfSnake, playerAndAISnake) 
{
	this.lengthOfSnake = lengthOfSnake;
	this.xAxisSnake = xAxisSnake;
	this.yAxisSnake = yAxisSnake;
	this.snakePreviousDirection = [];
	this.directionOfSnake = directionOfSnake;
	this.snakePreviousPosition = [];
	this.gameScore = 0;
	this.colorOfSnake = colorOfSnake;
	this.snakePreviousDirection = [];
	this.playerAndAISnake = playerAndAISnake;
}

// Player and AI Default Values Define
var ai = new Snake (5, canvas.offsetWidth / 2, canvas.offsetHeight / 2, "left", "rgb(150, 58, 76)", "ai");
var player = new Snake(5, canvas.offsetWidth / 2, canvas.offsetHeight / 2, "right", "rgb(58, 150, 132)", "player");

// Clear Canvas
function clearCanvas() 
{
	canvasDimension.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
}

// Work When Window Is Resized
function resizeWindow() 
{
  canvas.height = window.innerHeight / 2;
  canvas.width = window.innerWidth / 2;
  drawFood();
  snakeDraw();
}

// Pause The Game and Set Class Names
function gamePause() 
{
  if (gameIsPaused != true) 
  {
    game.className = '';
    pausePopUp.className = 'on';
    gameIsPaused = true;
    gameStop();
  }
}

// When Game Is Paused -> Resume The Game else Pause It
function pauseToResume() 
{
  if (gameIsPaused == true) 
  {
    gameResume();
  } 
  else 
  {
    gamePause();
  }
}

// Restart The Game and Set Class Names
function gameRestart() 
{
	ai = new Snake (5, canvas.offsetWidth / 2, canvas.offsetHeight / 2, "left", "rgb(150, 58, 76)", "ai");
	player = new Snake(5, canvas.offsetWidth / 2, canvas.offsetHeight / 2, "right", "rgb(58, 150, 132)", "player");
	gameOver = false;
	main();
}

// Start The Game and Set Class Names
function gameStart() 
{
  gameoverPopUp.className = '';
  pausePopUp.className = '';
  game.className = '';
  startPopUp.className = '';
  gameIsInProgress = true;
  gameIsPaused = false;
  main();
}

// Resume The Game and Set Class Names
function gameResume() 
{
  if (gameIsPaused == true) 
  {
    game.className = '';
    pausePopUp.className = '';
    gameIsPaused = false;
    main();
  }
}

// Draw Snake
function snakeDraw(snake) 
{
	canvasDimension.fillStyle = "white"; // Paint Head color
	paint(snake.xAxisSnake, snake.yAxisSnake);
	snake.snakePreviousPosition.unshift({ x: snake.xAxisSnake, y: snake.yAxisSnake });
	snake.snakePreviousDirection.unshift(snake.directionOfSnake);

	for (var i = 1; i < snake.lengthOfSnake; i++)  // Paint Snake 
	{
		if (snake.snakePreviousPosition[i]) 
		{
			paint(
				snake.snakePreviousPosition[i].x,
				snake.snakePreviousPosition[i].y,
				snake.colorOfSnake
			);
		}
	}

	// Update Position Of Snake With Arrows
	switch (snake.directionOfSnake) 
	{
		case "down":
			snake.yAxisSnake += SpeedOfSnake;
			break;

		case "up":
			snake.yAxisSnake -= SpeedOfSnake;
			break;

		case "right":
			snake.xAxisSnake += SpeedOfSnake;
			break;

		case "left":
			snake.xAxisSnake -= SpeedOfSnake;
			break;	
	}
}

// Draw Food
function drawFood() 
{
	if (eatFood) 
	{
		yAxisFoodPosition = Math.floor(Math.random() * canvas.offsetHeight - 5 ) + 5;
		xAxisFoodPosition = Math.floor(Math.random() * canvas.offsetWidth - 5 ) + 5;
		eatFood = false;
		paint(xAxisFoodPosition, yAxisFoodPosition, "green");
	}
	paint(xAxisFoodPosition, yAxisFoodPosition, "green");
}

//  Detect Crash With Canvas Walls
function detectCrash(xAxisSnake, yAxisSnake, xAxis, yAxis, radius) 
{
	var crashAxisY = yAxis - yAxisSnake;
	var crashAxisX = xAxis - xAxisSnake;
	if (crashAxisX >= -radius && crashAxisX <= radius) 
	{
		if (crashAxisY <= radius && crashAxisY >= -radius) 
		{
			return true;
		} 
		else 
		{
			return false;
		}
	} 
	else 
	{
		return false;
	}
}

// Player Move Function (Arrows) 
$(window).on("keydown", function(e) {
	switch (e.keyCode) 
	{
		case 40: // Down Arrow
			if (player.directionOfSnake !== "up") 
			{
				player.directionOfSnake = "down";
			}
			break;

		case 38: // Up Arrow
			if (player.directionOfSnake !== "down") 
			{
				player.directionOfSnake = "up";
			}
			break;

		case 39: // Right Arrow
			if (player.directionOfSnake !== "left") 
			{
				player.directionOfSnake = "right";
			}
		break;

		case 37: // Left Arrow
			if (player.directionOfSnake !== "right") 
			{
				player.directionOfSnake = "left";
			}
			break;
	}
});

// Paint Funtion
function paint(xAxis, yAxis, paintColor) 
{
	if (paintColor) 
	{
		canvasDimension.fillStyle = paintColor;
	} 
	else 
	{
		canvasDimension.fillStyle = "white"; // Snake Head Color
	}
	canvasDimension.fillRect(xAxis, yAxis, 5, 5);
}

// Check Who Lost
function checkPlayerCrashWithWalls(snake) 
{
	if (snake.xAxisSnake < 0 || snake.yAxisSnake < 0 || snake.yAxisSnake >= canvas.offsetHeight || snake.xAxisSnake >= canvas.offsetWidth) 
		{
			
			gameScore();
			gameIsInProgress = false;
 	 		gameStop();
			tryagainButton.textContent = '';
			message.textContent = '';
			message.textContent = "AI Won! Player Crash With The Wall";
			tryagainButton.textContent = 'Try Again';
			gameoverPopUp.className = 'on';
			game.className = ''; 
		}
}

// Game Over Function
function gameStop() 
{
	for (var i in gameIntervalDurationArray) 
	{
		clearInterval(gameIntervalDurationArray[i]);
	}
}

// Check Food Eat
function eatFoodCheck(snake) 
{
	if (detectCrash(snake.xAxisSnake, snake.yAxisSnake, xAxisFoodPosition, yAxisFoodPosition, 5)) 
	{
		snake.lengthOfSnake += 5;
		eatFood = true;
		snake.gameScore++;
	}
}

// Detect Crash With Self
function detectCrashWithSelf(snake, snakeCrash) 
{
	for (var i = 0; i < snakeCrash.lengthOfSnake; i++) 
	{
		if (snakeCrash.snakePreviousPosition[i]) 
		{
			if (detectCrash(snake.xAxisSnake, snake.yAxisSnake, snakeCrash.snakePreviousPosition[i].x, snakeCrash.snakePreviousPosition[i].y, 2)) 
			{
				gameScore();
				gameIsInProgress = false;
				gameStop();
				tryagainButton.textContent = '';
				message.textContent = '';
				if(snake.playerAndAISnake == "player")
				{
					message.textContent = "AI Won! Player Crash With Self/AI Snake" ;
				}
				else if(snake.playerAndAISnake == "ai")
				{
					message.textContent = "Player Won! AI Crash With Self/Player Snake" ;
				}
				tryagainButton.textContent = 'Try Again';
				gameoverPopUp.className = 'on';
				game.className = ''; 
			}
		}
	}
}

// AI Functions
function AIOperator(snake) 
{
	var AIPossibleMovement = [];
	var crashAxisX = xAxisFoodPosition - snake.xAxisSnake;
	var crashAxisY = yAxisFoodPosition - snake.yAxisSnake;

	if (snake.snakePreviousDirection[0] !== "left" && crashAxisX > 0)  // Turn Right
	{
		AIPossibleMovement.push("right");
	} 

	else if (snake.snakePreviousDirection[0] !== "right") // Turn Left
	{
		AIPossibleMovement.push("left");
	}

	if (snake.snakePreviousDirection[0] !== "up" && crashAxisY > 0) // Turn Down
	{
		AIPossibleMovement.push("down");
	}

	else if (snake.snakePreviousDirection[0] !== "down") // Turn Up
	{
		AIPossibleMovement.push("up");
	}

	AIPossibleMovement = AIPossibleMovementFilter(snake, AIPossibleMovement); // AI Possible Move

	if (AIPossibleMovement.length == 0) 
	{
		AIPossibleMovement.unshift("down"); // Add Value to the Array
		AIPossibleMovement.unshift("up"); // Add Value to the Array
		AIPossibleMovement.unshift("right"); // Add Value to the Array
		AIPossibleMovement.unshift("left"); // Add Value to the Array
		AIPossibleMovement = AIPossibleMovementFilter(snake, AIPossibleMovement); // AI Possible Move
	}

	var randomForArray = Math.floor(Math.random() * AIPossibleMovement.length); 
	snake.directionOfSnake = AIPossibleMovement[randomForArray];
}

// Best Move
function AIPossibleMovementFilter(snake, arrayOfMoves) 
{
	var currentXAxis = snake.xAxisSnake; // Current X Axis Value
	var currentYAxis = snake.yAxisSnake; // Current Y Axis Value
	var newArrayOfMoves = [];

	arrayOfMoves.forEach(function(info) 
	{
		var validMove = 0; // Count Valid Move Variable
		var countCrash = 0; // Count Crash Variable

		if (snake.directionOfSnake !== "right" && info == "left")  
		{
			if (currentXAxis - SpeedOfSnake > 3)  // Turn Left
			{
				for (var i = 0; i < snake.lengthOfSnake; i++) 
				{
					if (snake.snakePreviousPosition[i]) 
					{
						if (detectCrash(currentXAxis - SpeedOfSnake, currentYAxis, snake.snakePreviousPosition[i].x, snake.snakePreviousPosition[i].y, 3)) 
						{
							countCrash++;
						}
					}
				}

				for (var i = 0; i < player.lengthOfSnake; i++) 
				{
					if (player.snakePreviousPosition[i]) 
					{
						if (detectCrash(currentXAxis - SpeedOfSnake, currentYAxis, player.snakePreviousPosition[i].x, player.snakePreviousPosition[i].y, 3)) 
						{
							countCrash++;
						}
					}
				}

				if (!countCrash) 
				{
					validMove++;
				}
			}
		}

		if (snake.directionOfSnake !== "left" && info == "right")  
		{
			if (currentXAxis + SpeedOfSnake < canvas.offsetWidth - 3)  // Turn Right
			{
				for (var i = 0; i < snake.lengthOfSnake; i++) 
				{
					if (snake.snakePreviousPosition[i]) 
					{
						if (detectCrash(currentXAxis + SpeedOfSnake, currentYAxis, snake.snakePreviousPosition[i].x, snake.snakePreviousPosition[i].y, 3)) 
						{
							countCrash++;
						}
					}
				}

				for (var i = 0; i < player.lengthOfSnake; i++) 
				{
					if (player.snakePreviousPosition[i]) 
					{
						if (detectCrash(currentXAxis + SpeedOfSnake, currentYAxis, player.snakePreviousPosition[i].x, player.snakePreviousPosition[i].y, 3)) 
						{
							countCrash++;
						}
					}
				}

				if (!countCrash) 
				{
					validMove++;
				}
			}
		}

		if (snake.directionOfSnake !== "down" && info == "up")  
		{
			if (currentYAxis - SpeedOfSnake > 3) // Turn Up
			{
				for (var i = 0; i < snake.lengthOfSnake; i++) 
				{
					if (snake.snakePreviousPosition[i]) 
					{
						if (detectCrash(currentXAxis, currentYAxis - SpeedOfSnake, snake.snakePreviousPosition[i].x, snake.snakePreviousPosition[i].y, 3)) 
						{
							countCrash++;
						}
					}
				}

				for (var i = 0; i < player.lengthOfSnake; i++) 
				{
					if (player.snakePreviousPosition[i]) 
					{
						if (detectCrash(currentXAxis, currentYAxis - SpeedOfSnake, player.snakePreviousPosition[i].x, player.snakePreviousPosition[i].y, 3)) 
						{
							countCrash++;
						}
					}
				}

				if (!countCrash) 
				{
					validMove++;
				}
			}
		}

		if (snake.directionOfSnake !== "up" && info == "down") 
		{
			if (currentYAxis + SpeedOfSnake < canvas.offsetHeight - 3)  // Turn Down
			{
				for (var i = 0; i < snake.lengthOfSnake; i++) 
				{
					if (snake.snakePreviousPosition[i]) 
					{
						if (detectCrash(currentXAxis, currentYAxis + SpeedOfSnake, snake.snakePreviousPosition[i].x, snake.snakePreviousPosition[i].y, 3)) 
						{
							countCrash++;
						}
					}
				}

				for (var i = 0; i < player.lengthOfSnake; i++) 
				{
					if (player.snakePreviousPosition[i]) 
					{
						if (detectCrash(currentXAxis, currentYAxis + SpeedOfSnake, player.snakePreviousPosition[i].x, player.snakePreviousPosition[i].y, 3)) 
						{
							countCrash++;
						}
					}
				}

				if (!countCrash) 
				{
					validMove++;
				}
			}
		}

		if (validMove) 
		{
			newArrayOfMoves.unshift(info);
		}
	});

	return newArrayOfMoves;
}

// Game Score Function
function gameScore() 
{
	var scoreboardText = "Player : " + player.gameScore + "</br>AI : " + ai.gameScore;
	$("#gameScore").html(scoreboardText);
	// For Won Score
	/*if (player.gameScore == 5)
	{
		gameStop();
		gameIsInProgress = false;
		tryagainButton.textContent = '';
		message.textContent = '';
		message.textContent = "Player Won." ;
		tryagainButton.textContent = 'Try Again';
		gameoverPopUp.className = 'on';
		game.className = ''; 
	}
	else if (ai.gameScore == 5)
	{
		gameStop();
		gameIsInProgress = false;
		tryagainButton.textContent = '';
		message.textContent = '';
		message.textContent = "AI Won." ;
		tryagainButton.textContent = 'Try Again';
		gameoverPopUp.className = 'on';
		game.className = ''; 
	}*/
}

// Events Funtion
function keyFunction(mouseClick, keyCode) 
{
	var ekey = jQuery.Event("keydown");
	ekey.keyCode = keyCode;
	mouseClick.click(function() 
	{
		mouseClick.trigger(ekey);
	});
}
keyFunction($("#down"), 40);
keyFunction($("#up"), 38);
keyFunction($("#right"), 39);
keyFunction($("#left"), 37);

// Main Function
function main() {
	gameIntervalDurationArray.push(setInterval(function() 
	{		
			gameoverPopUp.className = '';
			pausePopUp.className = '';
			game.className = '';
			startPopUp.className = '';
			gameIsInProgress = true;
			gameIsPaused = false;
			clearCanvas();
			gameScore();
			snakeDraw(player);
			AIOperator(ai);
			snakeDraw(ai);
			drawFood();
			eatFoodCheck(player);
			eatFoodCheck(ai);
			detectCrashWithSelf(player, player);
			detectCrashWithSelf(ai, ai);
			detectCrashWithSelf(player, ai);
			detectCrashWithSelf(ai, player);
			checkPlayerCrashWithWalls(player);
		}, 1000 / framesPerSecond)
	);
}

// Event Functions
startButton.addEventListener('click', gameStart);
firstButton.addEventListener('click', gameResume);
tryagainButton.addEventListener('click', gameRestart);
secondButton.addEventListener('click', gameRestart);
window.addEventListener('resize', resizeWindow);
PauseButton.addEventListener('click', gamePause);