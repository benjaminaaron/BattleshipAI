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
    var player0 = player1 = null;

    switch($('#gameOptions').val()){
        case 'hb':
            var name = prompt('Enter your name:', 'Max');
            player0 = new Human(name);
            var player1 = createBot();       
            break;          
        case 'hh': 
            var name = prompt('Enter the name of Player 1:', 'Max');
            player0 = new Human(name);
            name = prompt('Enter the name of Player 2:', 'Erika');
            player1 = new Human(name);  
            break;
        case 'bb':
            player0 = new createBot();
            player1 = new createBot();
            break;
    }

    $('#gameOptions').hide();
    $('#startBtn').hide();
    $('#gameviewRadioBtn').hide();
    $('#statsviewRadioBtn').hide();
    
    $('#resetBtn').show();
    $('#statusLabel').html('in <b>setup phase</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
    var gameControlsWidth = (player1 ? 2 : 1) * 370 + (player1 ? 4 : 0);
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
* Initializes the bot object/s.
*/
function createBot(){
    var type = prompt('Choose the type of bot\n\nr      RandomBot\nrd    RandomDestroyerBot\nzsd  ZoningSquareDestroyerBot\nzrd  ZoningRectDestroyerBot\n', 'r');           
    var bot = false;
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
* Gets a canvas element from the window object and performs the draw call that is provided by the View layer of our application.
*/
function draw(){
    window.requestAnimationFrame(viewModule.draw());
}

function info(){
    var str = '<b>Setup phase</b>:<br>' +
  '- drag ships to place them<br>' + 
  '- click on a ship will flip its orientation<br>' +
  '- click on the field will randomly place all ships<br>' +
  '- click on your board outside of the field means you finished setting up ships<br><br>' +
  '<b>Play phase</b>:<br>' +
  '- just go ahead shooting around on the opponents field<br><br>' + 
  '<b>Build by</b>:<br>@stehrenberg<br>@chanton1392<br>@abstractCalculus<br>@benjaminaaron<br><br>' + 
  'More info at:<br>https://github.com/benjaminaaron/BattleshipAI';
  alert(str);
}

// UTILITY FUNCTIONS

function reset(){
    location.reload();
}

function ensure2Digits(content){
    var str = '' + content;
    if(str.length == 1)
        str = '0' + str;
    return str;
}

function getFormattedDate() {
    var date = new Date();
    var day = date.getDate();
    var month = (date.getMonth() + 1);
    var year = date.getFullYear();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();           
    return ensure2Digits(day) + '.' + ensure2Digits(month) + '.' + ensure2Digits(year) + ' ' + ensure2Digits(hour) + ':' + ensure2Digits(minute) + ':' + ensure2Digits(second);
}