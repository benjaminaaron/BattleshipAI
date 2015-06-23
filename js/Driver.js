/**
* The driver module provides controlling logic for the whole application. 
*/

var game, viewModule;

/** 
* Renders the game control bar within the browser window.
* Displays the appropriate buttons and status msg for init phase.
* Called upon creation of the driver script.
*/
function initializeGameControl() {
    registerButtonHandlers();
    showStatusInfo('game hasn\'t started yet&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
    $('#resetBtn').hide();
    $('#readyBtn').hide();
}

/**
 * Register EventHandlers on gamecontrol's buttons to start/reset the game, give info/help
 * or finish set up.
 */
function registerButtonHandlers() {
    $('#startBtn').on('click', startGame);
    $('#resetBtn').on('click', reset);
    $('#infoBtn').on('click', info);
    $('#readyBtn').on('click', function() { 
        console.log(game.currentPlayer);
        game.currentPlayer.iAmDoneSettingUp()
    });    // iAmDoneSettingUp does not exist at this point!
}

/**
* Callback-Method that handles the overall logic required for starting the game.
* Is called from index.html as soon as user clicks the "start game" button inside the game control bar.
*/
function startGame(){

    var players = initializePlayers();
    handleButtonDisplay();
    showStatusInfo('in <b>setup phase</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');

    var shipTypes = [
        new ShipType(1, 'black', 1), 
        new ShipType(5, 'aqua', 1), 
        new ShipType(4, 'maroon', 1), 
        new ShipType(3, 'lime', 1), 
        new ShipType(2, 'orange', 2)
    ];

    game = new Game(players, shipTypes, viewModule);
    viewModule = new GameView();
    viewModule.init(document.getElementById('viewContainer'));

    game.start();
}

/**
* Initializes Player objects as human players or bots, depending on input from the browser.
*/
function initializePlayers() {

    var players = [];
    players[0] = null;
    players[1] = null;
    var name;

    switch($('#gameOptions').val()){                            // DOM object containing a drop down menu where you can choose the playing mode
        case 'hb':
            name = prompt('Enter your name:', 'Max');
            players[0] = new Human(name);
            players[1] = createBot();
            break;
        case 'hh':
            name = prompt('Enter the name of Player 1:', 'Max');
            players[0] = new Human(name);
            name = prompt('Enter the name of Player 2:', 'Erika');
            players[1] = new Human(name);
            break;
        case 'bb':
            players[0] = createBot();
            players[1] = createBot();
            break;
    }

    return players;
}

function createBot(){

    var bot = false;
    var type = prompt(
        'Choose the type of bot\n\nr'
        + 'RandomBot\nrd'
        + 'RandomDestroyerBot\nzsd'
        + 'ZoningSquareDestroyerBot\nzrd'
        + 'ZoningRectDestroyerBot\n', 
        'r'                                         // default text displayed inside prompt
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
        alert('invalid input or that type of bot is not implemented yet, random bot is chosen instead');
        bot = new RandomBot('random bot');
    }

    return bot; 
}

/**
* Hides all buttons that are not necessary for game play phase.
* Displays an additional reset button.
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

/**
* CB function that shows an alert box with information on how to use the battleship application.
* Gets called as soon as user clicks the "info" button inside the game control bar.
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
* CB function that performs a simple page reload as application reset.
* Gets called as soon as the user clicks on the game control's "reset" button.
*/
function reset(){
    location.reload();
}

/** 
* Gets a canvas element from the window object and performs the draw call that is provided by the view layer of our application.
*/
function draw(){
    window.requestAnimationFrame(viewModule.draw());
}

///////////////////////////////////////////////////

initializeGameControl();
