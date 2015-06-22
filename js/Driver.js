/**
* The driver module provides controlling logic for the whole application. 
*/


$('#statusLabel').html('game hasn\'t started yet&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
$('#resetBtn').hide();
$('#readyBtn').hide();

var game, viewModule;

/**
* Handles the overall logic required for starting the game.
*/
function startGame(){

    initializePlayers();
    handleButtonDisplay();
    showStatusInfo('in <b>setup phase</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');

    // setting px width for tool bar "gameControls"
    var gameControlsWidth = 744;
    
    $('#gameControls').css('cssText', 'width: ' + gameControlsWidth + 'px !important');

    var shipTypes = [new ShipType(1, 'black', 1), new ShipType(5, 'aqua', 1), new ShipType(4, 'maroon', 1), new ShipType(3, 'lime', 1), new ShipType(2, 'orange', 2)];

    game = new Game(player0, player1, shipTypes, viewModule);

    if($('#gameviewRadioBtn').is(':checked'))
        viewModule = new GameView();
    if($('#statsviewRadioBtn').is(':checked')){
        alert('statsView is not available yet, choosing gameView instead');
          viewModule = new GameView();
    }
    viewModule.init(document.getElementById('viewContainer'));

    game.start();
}

/**
* Initializes Player objects as human players or bots, depending on input from the browser.
*/
function initializePlayers() {

    var player0 = player1 = null;
    var name;

    switch($('#gameOptions').val()){                            // DOM object containing a drop down menu where you can choose the playing mode
        case 'hb':
            name = prompt('Enter your name:', 'Max');
            player0 = new Human(name);
            player1 = createBot();       
            break;          
        case 'hh': 
            name = prompt('Enter the name of Player 1:', 'Max');
            player0 = new Human(name);
            name = prompt('Enter the name of Player 2:', 'Erika');
            player1 = new Human(name);  
            break;
        case 'bb':
            player0 = new createBot();
            player1 = new createBot();
            break;
    }
}

/**
* Displays only the buttons neccessary for the game initialization phase.
*/
function handleButtonDisplay() {

    $('#gameOptions').hide();
    $('#startBtn').hide();
    $('#gameviewRadioBtn').hide();
    $('#statsviewRadioBtn').hide();
    $('#resetBtn').show();
}

/**
* Displays the appropriate text within the status info field inside the game's toolbar.
*/
function showStatusInfo(statusMsg) {
    $('#statusLabel').html(statusMsg);
}

function createBot(){

    var bot = false;
    var type = prompt('
        Choose the type of bot\n\nr
        RandomBot\nrd
        RandomDestroyerBot\nzsd
        ZoningSquareDestroyerBot\nzrd
        ZoningRectDestroyerBot\n
        ', 
        'r'                     // default text displayed inside prompt
        );

    switch(type){
        case 'r':
            bot = new RandomBot('random bot');
            break;
        case 'rd':
            bot = new RandomDestroyerBot('random destroyer bot');
            break;
        case 'zsd':
            bot = new ZoningSquareDestroyerBot('zoning square destroyer bot');
            break;
        case 'zrd':
            bot = new ZoningRectDestroyerBot('zoning rect destroyer bot');
            break;
    }

    if(!bot){
        alert('invalid input or that type of bot isn\'t implemented yet, random bot is chosen instead');
        bot = new RandomBot('random bot');
    }

    return bot; 
}

/**
* Shows an alert box with information on how to use the battleship application.
*/
function info(){
    var str = 'Setup phase:\n' +
  '- drag ships to place them\n' + 
  '- click on a ship will flip its orientation\n' +
  '- click on the field will randomly place all ships\n' +
  '- click on your board outside of the field means you finished setting up ships\n\n' +
  'Play phase:\n' +
  '- just go ahead shooting around on the opponents field\n\n' + 
  'Build by:\n@stehrenberg\n@chanton1392\n@abstractCalculus\n@benjaminaaron\n\n' + 
  'More info at:\nhttps://github.com/benjaminaaron/BattleshipAI';
  alert(str);
}

/** 
* Gets a canvas element from the window object and performs the draw call that is provided by the View layer of our application.
*/
function draw(){
    window.requestAnimationFrame(viewModule.draw());
}


////////////////////////////// UTILITY FUNCTIONS //////////////////////////////

/**
* Performs a simple page reload
*/
function reset(){
    location.reload();
}
