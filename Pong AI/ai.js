//Global Variables
var canvas = document.getElementById('ponggameCanvas'); // Create Canvas
var dimension = canvas.getContext('2d'); // Game Dimension 
var framesPerSecond = 80; // Game Frames
var levelOfDifficulty = 1; // Diffivulty Level
var gameIsInProgress = false; // Save Game Situation
var gameDuration = window.setInterval(function () {}); // Game Interval
var gameIsPaused = false; // Save Game Situation
var sizeOfBall = 20; // Ball Size
var xAxisSpeedOfBall = 8; // Ball Speed In X Axis
var xAxisPositionOfBall = canvas.width / 2; // Ball Position In X Axis
var yAxisSpeedOfBall = 0; // Ball Speed In Y Axis
var yAxisPositionOfBall = canvas.height / 2; // Ball Position In Y Axis
var AIScore = 0; // AI Score
var playerScore = 0; // Player Score
var winScore = 5; // Score To Win The Game
var yAxisAIPaddle = 250; // AI Paddle
var yAxisPlayerPaddle = 250; // Player Paddle
var heightOfPaddle = 100; // Paddles Height
var widthOfPaddle = 15; // Paddles Width
var yAxisAIPaddleDirection = null; // AI Paddle Direction
var yAxisPlayerPaddleDirection = null; // Player Paddle Direction
var yAxisAIPaddleSpeed = 15; // AI Paddle Speed
var yAxisPlayerPaddleSpeed = 10; // Player Paddle Speed

var game = document.getElementById('game'); // game Menu
var startButton = document.getElementById('startButton'); // Start Button
var PauseButton = document.getElementById('PauseButton'); // Pause Button
var firstButton = document.getElementById('firstButton'); // Continue Button
var secondButton = document.getElementById('secondButton'); // Restart Button
var startPopUp = document.getElementById('startPopUp'); // Start Menu
var message = document.getElementById('message'); // Lose Message
var gameoverPopUp = document.getElementById('gameoverPopUp'); // Game Over Menu
var tryagainButton = document.getElementById('tryagainButton'); // Try Again Button

// Set Variables
canvas.height = window.innerHeight; // Canvas Height
canvas.width = window.innerWidth; // Set Canvas Width
yAxisAIPaddle = canvas.height / 2 - heightOfPaddle / 2; // Set AI Paddle Position in Y Axis
yAxisPlayerPaddle = canvas.height / 2 - heightOfPaddle / 2; // Set Player Paddle Position In Y Axis
yAxisSpeedOfBall = randomNumber(-6, 6) * (.30 * levelOfDifficulty); // Set Ball Speed In Y Axis
yAxisPositionOfBall = canvas.height / 2 - sizeOfBall / 2; // Set Ball Position In Y Axis

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
startPopUp.className = 'on'; 

// Set AI Paddle Speed To Random
function randomAISpeed() 
{
  yAxisAIPaddleSpeed = randomNumber(11, 21) * (.30 * levelOfDifficulty);
}

// Load The Game And Set Class Names
function gameStart() 
{
  gameoverPopUp.className = '';
  pausePopUp.className = '';
  game.className = '';
  startPopUp.className = '';
  gameIsInProgress = true;
  gameIsPaused = false;
  gameDuration = window.setInterval(function () {
    gameMovement();
    Draw();
  }, 1000 / framesPerSecond);
}

// Reset Ball Values To Default
function ballDefault() 
{
  xAxisPositionOfBall = canvas.width / 2;
  xAxisSpeedOfBall = -xAxisSpeedOfBall;
  yAxisPositionOfBall = canvas.height / 2;
  yAxisSpeedOfBall = randomNumber(-6, 6) * (.30 * levelOfDifficulty);
}

// Pause The Game And Set Class Names
function gamePause() 
{
  if (gameIsPaused != true) 
  {
    game.className = '';
    pausePopUp.className = 'on';
    gameIsPaused = true;
    clearInterval(gameDuration);
  }
}

// When Game Is Paused -> Resume The Game Else Pause It
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

// Restart The Game -> Default Values
function gameRestart() 
{
  playerScore = 0;
  AIScore = 0;
  levelOfDifficulty = 1,
  xAxisPositionOfBall = canvas.width / 2 - sizeOfBall / 2;
  yAxisPositionOfBall = canvas.height / 2 - sizeOfBall / 2;
  yAxisPlayerPaddle = canvas.height / 2 - heightOfPaddle / 2;
  yAxisAIPaddle = canvas.height / 2 - heightOfPaddle / 2;
  yAxisSpeedOfBall = randomNumber(-5, 5) * (.25 * levelOfDifficulty);
  gameStart();
}

// Work When Window Is Resized
function resizeWindow() 
{
  ballDefault();
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  Draw();
}

// Resume The Game and Set Class Names
function gameResume() 
{
  if (gameIsPaused == true) 
  {
    game.className = '';
    pausePopUp.className = '';
    gameIsPaused = false;
    gameStart();
  }
}

// When Release Key Function
function releaseKey(e) 
{
  yAxisPlayerPaddleDirection = null;
}

// Get A Random Number
function randomNumber(min, max) 
{
  return Math.random() * (max - min) + min;
}

// When Press Key Function
function pressKey(e) 
{
  e.preventDefault();
  switch (e.keyCode) 
  {
    case 38: // Up Arrow To Move Up The Paddle
      if (gameIsPaused != true) 
      {
        yAxisPlayerPaddleDirection = 'up';
      }
      break;
    case 40: // Down Arrow To Move Down The Paddle
      if (gameIsPaused != true) 
      {
        yAxisPlayerPaddleDirection = 'down';
      }
      break;
    case 13: // Press Enter For Pause/Resume The Game
      if (gameIsInProgress == true) 
      {
        pauseToResume();
      }
      break;
  }
}

// When Game Over Messages
function gameOver(winner) 
{
  gameIsInProgress = false;
  clearInterval(gameDuration);
  tryagainButton.textContent = '';
  message.textContent = '';
  if (winner == true) 
  {
    message.textContent = 'Player won!';
    tryagainButton.textContent = 'Play again';
  } 
  else 
  {
    message.textContent = 'AI Won!';
    tryagainButton.textContent = 'Try again';
  }
  gameoverPopUp.className = 'on';
  game.className = ''; 
}

// Movement Functions
function gameMovement() 
{
  xAxisPositionOfBall = xAxisPositionOfBall + xAxisSpeedOfBall;

  if (xAxisPositionOfBall > canvas.width - widthOfPaddle * 2 - sizeOfBall / 2) 
  {
    if (yAxisPositionOfBall <= yAxisAIPaddle + heightOfPaddle && xAxisPositionOfBall < canvas.width - widthOfPaddle &&  yAxisPositionOfBall >= yAxisAIPaddle) 
    {
      xAxisSpeedOfBall = -xAxisSpeedOfBall;
      if (yAxisPositionOfBall < yAxisAIPaddle + heightOfPaddle * .2 && yAxisPositionOfBall >= yAxisAIPaddle) 
      {
        yAxisSpeedOfBall = -15 * (.30 * levelOfDifficulty); // Ball Hit In Top Side Of AI Paddle - The ball goes up  
      } 
      else if (yAxisPositionOfBall < yAxisAIPaddle + heightOfPaddle * .4 && yAxisPositionOfBall >= yAxisAIPaddle + heightOfPaddle * .2) 
      {
        yAxisSpeedOfBall = -10 * (.30 * levelOfDifficulty); // Ball Hit Before The Center Of AI Paddle - The ball goes up  
      } 
      else if (yAxisPositionOfBall < yAxisAIPaddle + heightOfPaddle * .6 && yAxisPositionOfBall >= yAxisAIPaddle + heightOfPaddle * .4) 
      {
        yAxisSpeedOfBall = randomNumber(-6, 6); // Ball Hit In The Center Of AI Paddle - The ball goes random 
      } 
      else if (yAxisPositionOfBall < yAxisAIPaddle + heightOfPaddle * .8 && yAxisPositionOfBall >= yAxisAIPaddle + heightOfPaddle * .6) 
      {
        yAxisSpeedOfBall = 10 * (.30 * levelOfDifficulty); // Ball Hit After The Center Of AI Paddle - The ball goes down 
      } 
      else if (yAxisPositionOfBall < yAxisAIPaddle + heightOfPaddle && yAxisPositionOfBall >= yAxisAIPaddle + heightOfPaddle * .8) 
      {
        yAxisSpeedOfBall = 15 * (.30 * levelOfDifficulty); // Ball Hit In Bottom Side Of AI Paddle - The ball goes down  
      }
    } 
    else if (xAxisPositionOfBall > canvas.width) 
    {
      ballDefault();
      playerScore++;
      levelOfDifficulty = playerScore * 0.5;
      if (playerScore === winScore)
      {
        gameOver(true);
      }  
    }
    randomAISpeed();
  } 
  else if (xAxisPositionOfBall < widthOfPaddle * 2 + sizeOfBall / 2) 
  {
    if (yAxisPositionOfBall <= yAxisPlayerPaddle + heightOfPaddle &&  yAxisPositionOfBall >= yAxisPlayerPaddle && xAxisPositionOfBall > widthOfPaddle + sizeOfBall / 2) 
    {
      xAxisSpeedOfBall = -xAxisSpeedOfBall;
      if (yAxisPositionOfBall < yAxisPlayerPaddle + heightOfPaddle * .2 && yAxisPositionOfBall >= yAxisPlayerPaddle) 
      {
        yAxisSpeedOfBall = -20 * (.30 * levelOfDifficulty); // Ball Hit In Top Side Of Player Paddle - The ball goes up
      } 
      else if (yAxisPositionOfBall < yAxisPlayerPaddle + heightOfPaddle * .4 && yAxisPositionOfBall >= yAxisPlayerPaddle + heightOfPaddle * .2) 
      {
        yAxisSpeedOfBall = -10 * (.30 * levelOfDifficulty); // Ball Hit Before The Center Of Player Paddle - The ball goes up
      } 
      else if (yAxisPositionOfBall < yAxisPlayerPaddle + heightOfPaddle * .6 && yAxisPositionOfBall >= yAxisPlayerPaddle + heightOfPaddle * .4) 
      {
        yAxisSpeedOfBall = 0 * (.30 * levelOfDifficulty); // Ball Hit In The Center Of Player Paddle - The ball goes straight 
      } 
      else if (yAxisPositionOfBall < yAxisPlayerPaddle + heightOfPaddle * .8 && yAxisPositionOfBall >= yAxisPlayerPaddle + heightOfPaddle * .6) 
      {
        yAxisSpeedOfBall = 10 * (.30 * levelOfDifficulty); // Ball Hit After The Center Of Player Paddle - The ball goes down 
      } 
      else if (yAxisPositionOfBall < yAxisPlayerPaddle + heightOfPaddle && yAxisPositionOfBall >= yAxisPlayerPaddle + heightOfPaddle * .8) 
      {
        yAxisSpeedOfBall = 20 * (.30 * levelOfDifficulty); // Ball Hit In Bottom Side Of Player Paddle - The ball goes down 
      }
    } 
    else if (xAxisPositionOfBall <= -sizeOfBall) 
    {
      ballDefault();
      AIScore++;
      if (AIScore === winScore) 
      {
        gameOver(false);
      } 
    }
    randomAISpeed();
  }

  yAxisPositionOfBall = yAxisPositionOfBall + yAxisSpeedOfBall;

  if (yAxisPositionOfBall > canvas.height - sizeOfBall / 2) 
  {
    yAxisPositionOfBall = canvas.height - sizeOfBall / 2;
    yAxisSpeedOfBall = -yAxisSpeedOfBall;
  } 
  else if (yAxisPositionOfBall < sizeOfBall / 2) 
  {
    yAxisPositionOfBall = sizeOfBall / 2;
    yAxisSpeedOfBall = -yAxisSpeedOfBall;
  }

  if (yAxisPlayerPaddle >= 0 && yAxisPlayerPaddleDirection === 'up') 
  {
    yAxisPlayerPaddle = yAxisPlayerPaddle - yAxisPlayerPaddleSpeed;
  } 
  else if (yAxisPlayerPaddle < canvas.height - heightOfPaddle && yAxisPlayerPaddleDirection === 'down') 
  {
    yAxisPlayerPaddle += yAxisPlayerPaddleSpeed;
  }

  if (yAxisPositionOfBall < yAxisAIPaddle) 
  {
    yAxisAIPaddle -= yAxisAIPaddleSpeed;
  } 
  else if (yAxisPositionOfBall > yAxisAIPaddle + heightOfPaddle) 
  {
    yAxisAIPaddle += yAxisAIPaddleSpeed;
  }
}

// DRAW Functions
function Draw() 
{
  // Ball Draw
  dimension.clearRect(0, 0, canvas.width, canvas.height);
  dimension.fillStyle = 'rgb(51,153,255)';
  dimension.beginPath();
  dimension.arc(xAxisPositionOfBall, yAxisPositionOfBall, sizeOfBall / 2, 0, Math.PI * 2, true);
  dimension.fill();

  // Player Paddle Draw
  dimension.fillStyle = 'rgb(58, 150, 132)';
  dimension.fillRect(widthOfPaddle, yAxisPlayerPaddle, widthOfPaddle, heightOfPaddle); 

  // AI Paddle Draw
  dimension.fillStyle = 'rgb(150, 58, 76)';
  dimension.fillRect(canvas.width - widthOfPaddle - widthOfPaddle, yAxisAIPaddle, widthOfPaddle, heightOfPaddle); 

  // Vertical Line Draw
  dimension.strokeStyle = 'rgba(255,255,255,0.6)';
  dimension.beginPath();
  dimension.moveTo(canvas.width / 2, 0);
  dimension.lineTo(canvas.width / 2, canvas.height);
  dimension.stroke();

  // AI Score Draw
  dimension.fillStyle = 'rgba(150, 58, 76,0.5)';
  dimension.font = "200px 'Noto Sans KR', sans-serif";
  dimension.textAlign = "center";
  dimension.fillText(AIScore + "/5", canvas.width * .75, canvas.height / 2 + 75);

  // Player Score Draw
  dimension.fillStyle = 'rgba(58, 150, 132,0.5)';
  dimension.font = "200px 'Noto Sans KR', sans-serif";
  dimension.textAlign = "center";
  dimension.fillText(playerScore + "/5", canvas.width * .25, canvas.height / 2 + 75);
}  

// Event Functions
document.addEventListener('keydown', pressKey);
startButton.addEventListener('click', gameStart);
window.addEventListener('resize', resizeWindow);
document.addEventListener('keyup', releaseKey);
firstButton.addEventListener('click', gameResume);
tryagainButton.addEventListener('click', gameRestart);
secondButton.addEventListener('click', gameRestart);
PauseButton.addEventListener('click', gamePause);