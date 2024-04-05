// Configuration Of Game
var GameConfiguration = {
                            peripheralMargin: 200, // Peripheral Margin 
                            canvasLinesMargin: 5, // Margin Between Squares
                            backgroundColor: "rgb(255,225,53)", // Background Color
                            squaresColor: "rgb(0,0,0)", // Squares Color
                            xColor: "rgb(58, 150, 132)", // Symbol Color X
                            xHoverColor: "rgb(58, 150, 132, 0.5)", // On Hover Square -> Symbol Color X 
                            oColor: "rgb(150, 58, 76)", // Symbol Color O
                            oHoverColor: "rgb(150, 58, 76, 0.5)", // On Hover Square -> Symbol Color O
                            winLineColor: "rgba(255,0,0,0.8)", // Win Line Color
                            xoWidth: 9, // Symbols width (X and O)
                            winLineWidth: 13, // Win Line Width
                        };

// Global Variables
var canvas ; // Canvas
var dimension; // 2D
var widthOfPage; // Page Width
var heightOfPage; // Page Height
var panelSize; // 3x3 (Squares With Margin Lines) Size
var panelLeft; // 3x3 (Squares With Margin Lines) Margin From Left
var panelTop; // 3x3 (Squares With Margin Lines) Margin From Top
var squareSize; // Squares Size
var squareOffset; // Squares Offset
var squares; // Squares
var playerRound; // Player Round
var playerPlayFirst = 0; // First Play The Player
var mouseCoords; // Coordinates Of Mouse
var statusOfGame; // Game Status
var startPopUp = document.getElementById('startPopUp'); // Start Menu
var startButton = document.getElementById('startButton'); // Start Button
var tiePopUp = document.getElementById('tiePopUp'); // Tie Menu
var tieButton = document.getElementById('tieButton'); // Tie Button
var playerPopUp = document.getElementById('playerPopUp'); // Player Menu
var playerButton = document.getElementById('playerButton'); // Player Button
var AIPopUp = document.getElementById('AIPopUp'); // AI Menu
var AIButton = document.getElementById('AIButton'); // AI Button

// Setup - Declare And Set Class Names Of divs
startPopUp.className = 'on'; 
tie.className = '';
player.className = '';
ai.className = '';

function CanvasCreation() // Get HTML Objects
{
    var body = document.getElementsByTagName('body')[0]; // Get Body Element
    canvas = document.getElementById('tictactoeCanvas'); // Create Canvas Element
    dimension = canvas.getContext('2d'); // Get Canvas Context
    canvas.style.position = 'absolute'; // Set Canvas Position
    canvas.style.top = canvas.style.left = canvas.style.bottom = canvas.style.right = 0; // Set Canvas Top/ Left/ Bottom/ Right margin
    body.appendChild(canvas); // HTML DOM appendChild() -> append canvas
}

function CanvasSize() // Set Canvas Size
{
  widthOfPage = canvas.width = window.innerWidth; // Set Page Width In Pixel From HTML DOM window.innerWidth
  heightOfPage = canvas.height = window.innerHeight; // Set Page Height In Pixel From HTML DOM window.innerHeight
  panelSize = Math.min(widthOfPage, heightOfPage) - 2*GameConfiguration.peripheralMargin; // Set 3x3 (Squares With Margin Lines) Size
  squareSize = Math.floor((panelSize - 2*GameConfiguration.canvasLinesMargin)/3); // Set Squares Size
  squareOffset = squareSize+GameConfiguration.canvasLinesMargin; // Set Squares Offset
  panelTop = Math.floor(heightOfPage/2 - panelSize/2); // Set 3x3 (Squares With Margin Lines) Margin From Top
  panelLeft = Math.floor(widthOfPage/2 - panelSize/2); // Set 3x3 (Squares With Margin Lines) Margin From Left
  panelSize = 3*squareSize + 2*GameConfiguration.canvasLinesMargin; // Set 3x3 (Squares With Margin Lines) Size
}

function Default() // Reset to Default When The Game Finish
{ 
  //Set Class Names Of divs
  startPopUp.className = '';
  tie.className = '';
  player.className = '';
  ai.className = '';
  squares = []; // Squares Array 
  for(var i = 0; i < 9; i++)
  {
    squares[i] = null; // All The Squares Are Free
  }
  statusOfGame = { isWinner:null }; // No One Is The Winner
  playerRound = 1 - playerPlayFirst; // 1 Line Down (Play First The Player)  
  playerPlayFirst = 1 - playerPlayFirst; // 1 Line Up (Play First The AI)  
  mouseCoords = -1; // Mouse Coords
  roundSwitch(); // Switch round (AI play first or Player play first)
}

// Basic Functions
function addIntoPanel(indicator,human) // Add (Draw) The Symbols (X and O) To The 3x3 Panel
{
  squares[indicator] = human;
  statusOfGame = getResults(squares); // Check For Winner
  roundSwitch(); // Switch Round (AI Play First Or Player Play First)
}

function roundSwitch() // Switch Round (AI Play First or Player Play First)
{
  if (statusOfGame.isWinner === null)
  {
    playerRound = 1 - playerRound;
    if (playerRound === 1) // If Player Have Played First Then Is The AI Round To Play
    {      
      AIRound(squares,playerRound); 
    }
  }
  mouseCoords = -1; 
  xoDraw(); // Draw the X and O Symbols
}

function mousePosition(xAxis,yAxis,mouseClick) // All Mouse Functions
{
    var top; // Position From Top
    var left; // Position From Left
    var indicator = -1;

  for(var i = 0; i < 3; i++)
  {
    for(var j = 0; j < 3; j++)
    {
      left = panelLeft + i*squareOffset; // Set Postion From Left 
      top = panelTop + j*squareOffset; // Set Postion From Top 
      if (squares[toIndicatorCoords(i,j)] === null && xoInSquare(xAxis, yAxis, left, top, squareSize, squareSize))
      {        
            indicator = toIndicatorCoords(i,j); //Set Coords With The Help Of toIndicatorCoords Function
      }
    }
  }

  canvas.style.cursor = (indicator > -1)? 'cell' : 'no-drop'; // Set Cursor Type

  if (mouseClick && squares[indicator]===null)
  {
    addIntoPanel(indicator, playerRound); // Add Symbol To The Specific Square
  } 

  if (mouseCoords !== indicator) // If Mouse Coords Didnt Equals With Indicator Then Do mouseCoords Equals With indicator And Draw The Symbol
  {
    mouseCoords = indicator; // Save indicator Value To mouseCoords
    xoDraw(); // Draw The Symbols
  }
}

function findAllMoves(panel) // Check For Moves Into The Panel
{
  var allmoves = []; // Create Array For Moves
  for(var i = 0; i < 9; i++)
  {
    if (panel[i] === null)
    {
      allmoves.push(i); // Add Moves To Array (When Player Has Clicked And The AI Has Played)
    }
  }  
  return (allmoves.length > 0)? allmoves : null; // Return allmoves Array Length Else Set All moves To null
}


function getResults(panel) // Check For The Winner
{
    var freeSquares;

  // Win Check (Vertical - Horizontal)
  for(var i = 0; i < 3; i++)
  {
    if (panel[toIndicatorCoords(i,0)] !== null && panel[toIndicatorCoords(i,0)] === panel[toIndicatorCoords(i,1)] && panel[toIndicatorCoords(i,0)] === panel[toIndicatorCoords(i,2)])
    {
      return {
        isWinner: panel[toIndicatorCoords(i,0)], // Set Winner
        squares: [{x:i,y:0}, {x:i,y:1}, {x:i,y:2}] // Set The Squares Of Win
      };
    }
    if (panel[toIndicatorCoords(0,i)] !== null && panel[toIndicatorCoords(0,i)] === panel[toIndicatorCoords(1,i)] && panel[toIndicatorCoords(0,i)] === panel[toIndicatorCoords(2,i)])
    {
      return {
        isWinner: panel[toIndicatorCoords(0,i)], // Set Winner
        squares: [{x:0,y:i}, {x:1,y:i}, {x:2,y:i}] // Set The Squares Of Win
      };
    }
  }
  
  // Win Check (Diagonal)
  if (panel[toIndicatorCoords(0,0)] !== null && panel[toIndicatorCoords(0,0)] === panel[toIndicatorCoords(1,1)] && panel[toIndicatorCoords(0,0)] === panel[toIndicatorCoords(2,2)])
  {
    return {
      isWinner: panel[toIndicatorCoords(0,0)], // Set Winner
      squares: [{x:0,y:0}, {x:1,y:1}, {x:2,y:2}], // Set The Squares Of Win
    };
  }
  if (panel[toIndicatorCoords(0,2)] !== null && panel[toIndicatorCoords(0,2)] === panel[toIndicatorCoords(1,1)] && panel[toIndicatorCoords(0,2)] === panel[toIndicatorCoords(2,0)])
  {
    return {
      isWinner: panel[toIndicatorCoords(0,2)], // Set Winner
      squares: [{x:0,y:2}, {x:1,y:1}, {x:2,y:0}] // Set The Squares Of Win
    };
  }
  
  // Check for Draw
  freeSquares = findAllMoves(panel); // Check For Free Squares Into The Panel
  
  if (freeSquares) // If There Is A Winner Then Return The Winner, If Not, Didnt Return Anything
  {
    return {
      isWinner: null, 
      squares: freeSquares
    };
  }
  else
  {
    return { 
      isWinner: -1, 
      squares: null
    };
  }
}

// AI Functions
function AIRound(panel, player) // AI Move Play Function
{
    var results = getResults(panel);
    var bestMove; // Best Move
    var testAlphaBetaSteps; // Test Two Moves
    var testPanel;
    var bestAlphaBetaStep = -2; // Best Move Of The Algorithm

  for(var i = 0; i < results.squares.length; i++) // Test/Find The Best Move From The AlphaBeta Algorithm
  {      
    testPanel = panel.slice(0);
    testPanel[results.squares[i]] = player;
    testAlphaBetaSteps = AlphaBeta(testPanel, -999, 999, player, false);
    if (testAlphaBetaSteps > bestAlphaBetaStep)
    {
      bestMove = results.squares[i];
      bestAlphaBetaStep = testAlphaBetaSteps;
    }
  }
  addIntoPanel(bestMove,player); // Add The Symbol To 3x3 Panel
};

function AlphaBeta(panel, first, second, player, playerMax)
{
    var result = getResults(panel); // Set Results To Result Variable
    var newPanel; // Create Panel Copy

  if (result.isWinner !== null) // Check If There Is A Winner
  {
    if (result.isWinner === player) // Winner Is Player
    { 
        return 1; 
    }
    else if (result.isWinner === 1-player) // Tie
    { 
        return -1; 
    }
    else
    { 
        return 0; // Winner Is AI
    }
  }

  if (playerMax)
  {
    for(var i = 0; i < result.squares.length; i++) // Check Steps
    {
      newPanel = panel.slice(0);
      newPanel[result.squares[i]] = player;
      first = Math.max(first, AlphaBeta(newPanel, first, second, player, false));
      if(second <= first)
      {
        break;
      }
    }
    return first;   
  }
  else
  {
    for(var i = 0; i < result.squares.length; i++) // Check Steps
    {
      newPanel = panel.slice(0);
      newPanel[result.squares[i]] = 1-player;
      second = Math.min(second, AlphaBeta(newPanel, first, second, player, true));
      if (second <= first)
      {
        break; 
      }
    }
    return second;
  }
};

// Drawing Functions
function xoDraw()
{
    var squareIsHovered; // Hover Square Variable
    var indicator;
    var left; // Postion From Left 
    var top; // Postion From Top;
    var my_gradient=dimension.createLinearGradient(440, 0 , 300, 600);
    my_gradient.addColorStop(1, "rgb(66, 202, 255)");
    my_gradient.addColorStop(0, "rgb(232, 26, 255)");
    dimension.fillStyle = my_gradient; // Game Background Color
    dimension.fillRect(0, 0, widthOfPage, heightOfPage);  // Fill The Page
  
  for(var i = 0; i < 3; i++)
  {
    for(var j = 0; j < 3; j++)
    {
      top = panelTop + j*squareOffset; // Set Postion From Top
      left = panelLeft + i*squareOffset; // Set Postion From Left
      indicator = toIndicatorCoords(i,j); // Set indicator
      squareIsHovered = (indicator === mouseCoords); // Set squareIsHovered Variable (When The Mouse Hover A Square)
      squareDraw(squares[indicator], left, top, squareSize, squareIsHovered); //Draw The Symbols
    }
  }

  if (statusOfGame.isWinner === 0) // Winner is the Player 
  { 
    winnerLineDraw(); // Draw the Win Line
    player.className = 'on';
  }
  else if (statusOfGame.isWinner === 1) // Winner is the AI 
  { 
    winnerLineDraw(); // Draw the Win Line
    ai.className = 'on';
  }
  else if (statusOfGame.isWinner === -1) // Tie
  {
    tie.className = 'on';
  }

}

function squareDraw(human, left, top, sizesquare, isClicked)
{
  dimension.fillStyle = GameConfiguration.squaresColor; // Squares color
  dimension.fillRect(left, top, squareSize, squareSize); // Fill The Squares
  
  if (human === 0 || (playerRound === 0 && isClicked)) // Draw The Player Symbol X
  {
    symbolXDraw(left, top, sizesquare);
    dimension.strokeStyle = (isClicked && human===null)? GameConfiguration.xHoverColor : GameConfiguration.xColor; // Set Symbol Color
    dimension.lineWidth = (squareSize/100) * GameConfiguration.xoWidth; // Set Symbol Width
    dimension.stroke(); // Draw The Symbol (With moveTo And lineTo)
  }
  else if (human === 1 || (playerRound === 1 && isClicked)) // Draw The AI Symbol O
  {
    symbolODraw(left, top, sizesquare);
    dimension.strokeStyle = (isClicked && ai===null)? GameConfiguration.oHoverColor : GameConfiguration.oColor; // Set Symbol Color
    dimension.lineWidth = (squareSize/100) * GameConfiguration.xoWidth; // Set Symbol Width
    dimension.stroke(); // Draw The Symbol (with moveTo and lineTo)
  }
  else 
  {
    return; 
  }
  
}

function symbolXDraw(left, top, sizeX) // Draw The X Symbol
{
  var xAxis1 = left + 0.2 * sizeX; // Horizontal Coord 1
  var xAxis2 = left + 0.8 * sizeX; // Horizontal Coord 2
  var yAxis1 = top + 0.2 * sizeX; // Vertical Coord 1
  var yAxis2 = top + 0.8 * sizeX; // Vertical Coord 2
  dimension.beginPath(); // The Following Commands Draw The X Symbol
  dimension.moveTo(xAxis1, yAxis1);
  dimension.lineTo(xAxis2, yAxis2);
  dimension.moveTo(xAxis1, yAxis2);
  dimension.lineTo(xAxis2, yAxis1); 
}

function symbolODraw(left, top, sizeO) // Draw The O Symbol
{
  var xAxis = left + 0.5 * sizeO; // Horizontal Coord 
  var yAxis = top + 0.5 * sizeO; // Vertical Coord 
  var radius = 0.3 * sizeO; // Radius 
  dimension.beginPath();
  dimension.arc(xAxis, yAxis, radius, 0, 2*Math.PI, false); // Create Circle
}

function winnerLineDraw() // Draw The Win Line
{
  var xAxis1 = panelLeft + statusOfGame.squares[0].x * squareOffset + 0.5 * squareSize;  // From Left - Horizontal Coord 1
  var xAxis2 = panelLeft + statusOfGame.squares[2].x * squareOffset + 0.5 * squareSize;  // From Left  - Horizontal Coord 2
  var yAxis1 = panelTop + statusOfGame.squares[0].y * squareOffset + 0.5 * squareSize;   // From Top - Vertical Coord 1
  var yAxis2 = panelTop + statusOfGame.squares[2].y * squareOffset + 0.5 * squareSize;   // From Top - Vertical Coord 2
  var xAxisDistance = 0.2 * (xAxis2-xAxis1);
  var yAxisDistance = 0.2 * (yAxis2-yAxis1);
  
  yAxis2 += yAxisDistance;
  yAxis1 -= yAxisDistance;
  xAxis2 += xAxisDistance;
  xAxis1 -= xAxisDistance;
  
  dimension.beginPath();// The Following Commands Draw The O Symbol
  dimension.moveTo(xAxis1, yAxis1);
  dimension.lineTo(xAxis2, yAxis2);
  dimension.lineWidth = (squareSize/100) * GameConfiguration.winLineWidth; // Set Line Width
  dimension.strokeStyle = GameConfiguration.winLineColor; // Set Win Line Style
  dimension.stroke(); // Draw The Win Line (With moveTo And lineTo)
}

// Help Functions
function toIndicatorCoords(xAxis,yAxis) // Take The Coords Of Mouse And Find The Distance From indicator
{
  return xAxis + 3 * yAxis;
}

function xoInSquare(xAxis, yAxis, left, top, width, height) 
{
  return (xAxis>left && xAxis<left+width && yAxis>top && yAxis<top+width);
}

// Game - Events Functions
function gameLoad() // Load When The Game Starts
{
  CanvasCreation(); // Create Canvas
  CanvasSize(); // Set Canvas Size
  Default(); // Set All Values To Default
}

function windowResize() // Load When Player Resize The Window
{
  CanvasSize(); // Set Canvas Size
  xoDraw(); // Draw Again The Symbols
}

function mouseMove(move) // When Mouse Move Save Mouse Coordinators
{
  if (playerRound === 0)
  {
    mousePosition(move.clientX, move.clientY);
  }
}

function mouseClick(click)  
{
  if (playerRound === 0) // Save Mouse Position
  {
    mousePosition(click.clientX, click.clientY, true); 
  }
}

startButton.addEventListener('click', gameLoad); // Enable Event
tieButton.addEventListener('click', gameLoad); // Enable Event
playerButton.addEventListener('click', gameLoad); // Enable Event
aiButton.addEventListener('click', gameLoad); // Enable Event
window.addEventListener('mousedown',mouseClick); // Enable Event
window.addEventListener('mousemove',mouseMove); // Enable Event
window.addEventListener('resize',windowResize); // Enable Event