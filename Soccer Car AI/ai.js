
function setup() // Main Function (Run automatically)
{
  noLoop() // Stop Running In Loop Setup
  // Set Class Names
  gameoverPopUp.className = '';
  pausePopUp.className = '';
  game.className = '';
  gameIsPaused = false;
  const canvas = createCanvas(window.innerWidth / 2,window.innerHeight / 2); // Create Canvas
  canvas.parent('game'); // Create Canvas Into Game div
  canvas.id('soccerCanvas');  // Set Canvas id
  goalField = width/6; // Set Goal Field Width
  carEnginee = carEngine.create(); // Create Engine
  canvasWorld = carEnginee.world;
  carEnginee.world.gravity.y = 0;
  drawWalls();// Draw Walls
  const playerCarColor = [58, 150, 132] ;// Player Car Color
  const playerxAxisCarStartPosition = width/4; // Player Car Start Position
  playerCar = new soccerCar(playerCarColor, playerxAxisCarStartPosition); // Create Player Car Object
  const AICarColor = [150, 58, 76]; // AI Car Color
  const aixAxisCarStartPosition = 3*width/4; // AI Car Start Position
  aiCar = new soccerCar(AICarColor, aixAxisCarStartPosition); // Create AI Car Object
  mainBall = new soccerBall(); // Create Ball Object
}

var game = document.getElementById('game'); // game Menu
var canvas = document.getElementById('soccerCanvas'); // Create Canvas
var framesPerSecond = 7; // Game Frames
var gameIsInProgress = false; // Save Game Situation
var gameIsPaused = false; // Save Game Situation
var startButton = document.getElementById('startButton'); // Start Button
var PauseButton = document.getElementById('PauseButton'); // Pause Button
var firstButton = document.getElementById('firstButton'); // Continue Button
var secondButton = document.getElementById('secondButton'); // Restart Button
var startPopUp = document.getElementById('startPopUp'); // Start Menu
var message = document.getElementById('message'); // Lose Message
var gameoverPopUp = document.getElementById('gameoverPopUp'); // Game Over Menu
var tryagainButton = document.getElementById('tryagainButton'); // Try Again Button

// When Blur Is Active Then Pause Game
onblur = function () 
{
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

// Load the Game and Set Class Names
function gameStart() 
{
  loop()
  gameoverPopUp.className = '';
  pausePopUp.className = '';
  game.className = '';
  startPopUp.className = '';
  gameIsInProgress = true;
  gameIsPaused = false;
}

// Restart The Game -> Default Values
function gameRestart() 
{
  playerScore = 0;
  AIScore = 0;
  setup();
  loop()
}

// Pause The Game and Set Class Names
function gamePause() 
{
  if (gameIsPaused != true) 
  {
    noLoop()
    game.className = '';
    pausePopUp.className = 'on';
    gameIsPaused = true;
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

// Work When Window Is Resized
function resizeWindow() 
{
  drawSoccerField()
  drawWalls()
  drawBall()
  drawCar()
  canvas.height = window.innerHeight / 2;
  canvas.width = window.innerWidth / 2;
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

//Create Wall Constructor
class canvasWall 
{
  constructor(xAxis, yAxis, wallWidth, wallHeight, wallAngle) 
  {
    var defaultValues = {friction: 0.7, isStatic: true, angle: wallAngle, restitution: 0.7}
    this.body = Bodies.rectangle(xAxis, yAxis, wallWidth, wallHeight, defaultValues);
    this.wallWidth = wallWidth;
    this.wallHeight = wallHeight;
    World.add(canvasWorld, this.body);
  }
}

//Create Ball Constructor
class soccerBall
{
  constructor() 
  {
    const defaultValues = {friction: 0.05, restitution: 1, density: 0.003}
    this.position = createVector(width/2, height/2)
    this.radius = width/30
    this.body = Bodies.circle(this.position.x, this.position.y, this.radius/2, defaultValues)
    World.add(canvasWorld, this.body)
  }

  carScore() // When Car Score
  {
    const [xAxis, yAxis] = [this.body.position.x, this.body.position.y]
    const yAxisGoalBottomFieldLimit = height/2 - goalField/2
    const yAxisGoalTopFieldLimit = height/2 + goalField/2
    const inGoalFieldLimit = yAxis < yAxisGoalTopFieldLimit && yAxis > yAxisGoalBottomFieldLimit
    if (inGoalFieldLimit) 
    {
      return (xAxis >= width - this.radius/2 || xAxis <= this.radius/2)
    }
    return false
  }

  drawBall() // Draw Ball
  {
    this.position.y = this.body.position.y
    this.position.x = this.body.position.x
    push()
    translate(this.body.position.x, this.body.position.y)
    rotate(this.body.angle)
    fill(51,153,255) // Ball Color
    ellipse(0, 0, this.radius)
    fill(0,0,0) // Center Tiny Ellipse Color
    ellipse(0, 0, this.radius/4)
    fill(255,255,255) // 4 Tiny Color Ellipse
    ellipse(-8, -8, this.radius/4)
    ellipse(8, 8, this.radius/4)
    ellipse(8, -8, this.radius/4)
    ellipse(-8, 8, this.radius/4)
    pop()
  }
}

// Create Car Constructor
class soccerCar 
{
  constructor(carColor, xAxisCarStartPosition) 
  {
    const yAxisCarStartPosition = xAxisCarStartPosition < width/2 ? height/2 : 2*height/3 // Cars Starting Position
    this.position = createVector(xAxisCarStartPosition, yAxisCarStartPosition)
    this.width = width/34
    this.length = this.width * 2
    this.rotation = 0
    const defaultValues = { density: 0.1, friction: 0.15, mass: 60 }
    this.body = Bodies.rectangle(this.position.x, this.position.y, this.length, this.width, defaultValues)
    this.color = carColor
    World.add(canvasWorld, this.body)
    if (xAxisCarStartPosition > width/2) 
    {
      itemBody.setAngle(this.body, PI)
    }
  }

  updateCarStatus() // Update Status Of Car
  {
    if (this.isAccelerating) 
    {
      this.carsAcceleration()
    }
    this.position.y = this.body.position.y
    this.position.x = this.body.position.x
    this.rotate(this.rotation)
  }

  carIsAccelerating(carAccelerating) // When UP Arrow Key Is Pressed
  {
    this.isAccelerating = carAccelerating
  }

  carsAcceleration() // Set Speed Of Car
  {
    var force = p5.Vector.fromAngle(this.body.angle)
    force.mult(0.025);
    itemBody.applyForce(this.body, this.body.position, force)
  }

  rotate(itemRotate) // Rotate
  {
    this.rotation = itemRotate
    itemBody.setAngularVelocity(this.body, itemRotate)
  }

  ballPoint() // Coords to Ball
  {
    const ballPoint = p5.Vector.sub(mainBall.position, this.position)
    const ballAngle = ballPoint.heading()
    itemBody.setAngle(this.body, ballAngle);
  }
  
  drawCar() // Draw Car
  {
    var carAngle = this.body.angle;
    push()
    rectMode(CENTER)
    translate(this.body.position.x, this.body.position.y)
    rotate(carAngle);
    
    // Car's Tires
    fill(166,166,166)
    ellipse(this.length/3, -this.width/2, this.width/3, this.width/5) //Top Left Tire
    ellipse(this.length/3, this.width/2, this.width/3, this.width/3.6) // Top Right Tire
    ellipse(-this.length/3, -this.width/2, this.width/3, this.width/5) // Bottom Left Tire
    ellipse(-this.length/3, this.width/2, this.width/3, this.width/3.6) // Bottom Right Tire

    // Car's Body
    fill(this.color)
    rect(0, 0, this.length, this.width, 7); // Car Shape
    fill(166,166,166); // Car's Windows Color
    rect(-this.length/24, 0, 0.7 * this.length, 0.8 * this.width, 7); // Cars Windows Shape
    fill(this.color); // Cars Top Shape Color
    rect(-this.length/12, 0, 0.45 * this.length, 0.6 * this.width, 7); // Cars Top Shape

    // Car's Headlights
    fill(255, 255, 255)
    ellipse(this.length/2, -this.width/3, this.width/8, this.width/4); // Left Headlight
    ellipse(this.length/2, this.width/3, this.width/8, this.width/4); // Right Headlight
    pop()
    push()
    noStroke();
    pop()
  }
}

const World = Matter.World;
const carEngine = Matter.Engine;
const itemBody = Matter.Body;
const Bodies = Matter.Bodies;

let aiCar;
let playerCar;
let canvasWorld;
let mainBall;
let carEnginee;
let goalField;
let goal = false;
let playerScore = 0;
let AIScore = 0;

function keyReleased() 
{
  if (keyCode == UP_ARROW) 
  {
    playerCar.carIsAccelerating(false)
  } 
  else if (keyCode == LEFT_ARROW) 
  {
    playerCar.rotate(0)
  }
  else if (keyCode == RIGHT_ARROW) 
  {
    playerCar.rotate(0)
  }
}

function keyPressed() 
{
  if (keyCode == UP_ARROW) 
  {
    playerCar.carIsAccelerating(true)
  }
  else if (keyCode == LEFT_ARROW) 
  {
    playerCar.rotate(-PI/72)
  } 
  else if (keyCode == RIGHT_ARROW)
   {
    playerCar.rotate(PI/72)
  } 
}

// Draw Everything Function // Draw Main Function 
function draw() 
{
  drawSoccerField()
  mainBall.drawBall()
  carEngine.update(carEnginee)
  aiCar.drawCar()
  aiCar.updateCarStatus()
  aiCar.carIsAccelerating(true)
  aiCar.ballPoint()
  playerCar.drawCar()
  playerCar.updateCarStatus()

  if (mainBall.carScore()) 
  {
    const [xAxis, yAxis] = [mainBall.body.position.x, mainBall.body.position.y]
    xAxis < width/2 ? AIScore++ : playerScore++;
    itemBody.setVelocity(mainBall.body, { x: 0, y: 0 })
    itemBody.setPosition(mainBall.body, { x: width/2, y: height/2 });
    goal = true
    setTimeout(function() 
    {
      goal = false
    }, 1000);
  }
  
  // Draw Player/AI Text And Scores
  textSize(18);
  noStroke();
  fill(58, 150, 132);
  text("Player", width/2 - 100, height/16);
  fill(150, 58, 76);
  text("AI", width/2 + 50, height/16)
  fill(4);
  textSize(48);
  fill(58, 150, 132);
  text(playerScore, width/2 - 105, height/6);
  fill(58, 150, 132);
  text('/5', width/2 - 75, height/6);
  fill(150, 58, 76);
  text(AIScore, width/2 + 45, height/6);
  text('/5', width/2 + 75, height/6);

  if (goal) 
  {
    fill(235, 27, 254); //Goal Color
    textFont('Noto Sans Kr');
    textSize(68);
    text("GOAL!", width/2 -100, height/2)
  }
  
  if (playerScore === 5) 
  {
    noLoop();
    message.textContent = 'Player won!';
    tryagainButton.textContent = 'Play again';
    gameoverPopUp.className ='on';
  } 
  else if((AIScore === 5))
  {
    noLoop();
    message.textContent = 'AI Won!';
    tryagainButton.textContent = 'Try again';
    gameoverPopUp.className ='on';
  }
}

function drawSoccerField() // Draw Soccer Field
{
  background(000)
  noFill()
  stroke(55)
  strokeWeight(2)

  // Center Line Of Goal
  stroke(170,170,170);
  line(width/2, 0, width/2, height)
  ellipse(width/2, height/2, width/6)

  // Left Box Of Goal
  rect(0, height/2 - width/6, width/6, width/3)
  stroke(58, 150, 132);
  rect(0, height/2 - width/12, width/18, goalField)
  strokeWeight(10);
  line(0, height/2 - width/12, 0, height/2 - width/12 + goalField)
  
  // Right Box Of Goal
  strokeWeight(2);
  stroke(170,170,170);
  rect(width - width/6, height/2 - width/6, width/6, width/3)
  stroke(150, 58, 76);
  rect(width - width/18, height/2 - width/12, width/18, goalField);
  strokeWeight(12);
  line(width, height/2 - width/12, width, height/2 - width/12 + goalField);
  strokeWeight(1);
  stroke(0);
}

function drawWalls() // Draw 4 Walls
{
  const canvasWallWeight = 500;
  const canvasWallWeight2 = canvasWallWeight/2;
  topWall = new canvasWall(width/2, -canvasWallWeight2, width, canvasWallWeight, 0)
  rightWall = new canvasWall(width + canvasWallWeight2, height/2, height, canvasWallWeight, PI/2)
  leftWall = new canvasWall(-canvasWallWeight2, height/2, height, canvasWallWeight, PI/2)
  bottomWall = new canvasWall(width/2, height + canvasWallWeight2, width, canvasWallWeight, 0)
}

// Event Functions
startButton.addEventListener('click', gameStart);
window.addEventListener('resize', resizeWindow);
firstButton.addEventListener('click', gameResume);
tryagainButton.addEventListener('click', gameRestart);
secondButton.addEventListener('click', gameRestart);
PauseButton.addEventListener('click', gamePause);