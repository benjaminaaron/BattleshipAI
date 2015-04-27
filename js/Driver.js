
$('.dialog').dialog({
    width: 850,
    autoOpen: false,
    show: {
        effect: 'fade',
        duration: 400
    },
    hide: {
        effect: 'fade',
        duration: 400
    }
}); 

$('#statusLabel').html('game hasn\'t started yet&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
$('#resetBtn').hide();
$('#readyBtn').hide();

var firebase = new Firebase('https://torrid-inferno-2196.firebaseio.com');  
var game, viewModule;

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
        case 'b':
            player0 = new createBot();  
            break;
        case 'h':
            var name = prompt('Enter your name:', 'Max');
            player0 = new Human(name);
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

    var shipTypes = [new ShipType(5, 'aqua', 1), new ShipType(4, 'maroon', 1), new ShipType(3, 'lime', 1), new ShipType(2, 'orange', 2)];

    if($('#gameviewRadioBtn').is(':checked'))
        viewModule = new GameView();
    if($('#statsviewRadioBtn').is(':checked'))
        viewModule = new StatsView();

    viewModule.init(document.getElementById('viewContainer'), player0, player1);

    game = new Game(player0, player1, shipTypes, viewModule);
    game.start();
}

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

function draw(){
    window.requestAnimationFrame(drawGame);
}

function drawGame(){
    //console.log('drawing');
    viewModule.draw();
}

function info(){
    var str = '<b>Setup phase</b>:<br>' +
  '- drag ships to place them<br>' + 
  '- click on a ship will flip its orientation<br>' +
  '- click on the field will randomly place all ships<br>' +
  '- click on your board outside of the field means you finished setting up ships<br><br>' +
  '<b>Play phase</b>:<br>' +
  '- just go ahead shooting around on the opponents field<br><br>' + 
  'The single modes are there as benchmarks and for development and training of the AI.<br><br>' + 
  '<b>Build by</b>:<br>@stehrenberg<br>@chanton1392<br>@abstractCalculus<br>@benjaminaaron<br><br>' + 
  'More info at:<br>https://github.com/benjaminaaron/BattleshipAI';
    var popup = $('#infoDialog');
    popup.dialog('option', 'title', 'Info');
    popup.html('');  
    popup.append(str);
    popup.dialog('open'); 
}

var HighscoreEntry = function(player0, player1, winnerIndex, shots, timestamp){
    this.player0 = player0;
    this.player1 = player1;
    this.winner = winnerIndex == 0 ? player0 : player1;
    this.looser = winnerIndex == 0 ? player1 : player0;
    this.shots = shots;
    this.timestamp = timestamp;
    this.toString = function(){
        var str = this.timestamp + '&nbsp;&nbsp;&nbsp;&nbsp;<b>' + this.winner + '</b> won against <b>'  + this.looser + '</b> with <b>' + shots + '</b> shots';
        return str;
    }
}

function showHighscore(){
    var popup = $('#highscoreDialog');  
    popup.dialog('open');

    if(firebase){
        var highscoreEntries = [];
        console.log('fetching data from firebase...');

        firebase.once('value', function(dataSnapshot) {
            
            
            console.log(dataSnapshot.val());
            
            
            var entries = dataSnapshot.val();
            for (var indexStr in entries) {
                if (entries.hasOwnProperty(indexStr)) {
                    var entry  = entries[indexStr];
                    
                    console.log(entry);

                }
            }
            
            
            
            
 /*           
            var entries = dataSnapshot.val();
            for (var indexStr in entries) {
                if (entries.hasOwnProperty(indexStr)) {
                    var entry  = entries[indexStr];
                    var newHighscoreEntry = new HighscoreEntry(entry.player0, entry.player1, entry.winner, entry.shots, entry.timestamp);
                    highscoreEntries.push(newHighscoreEntry);
                }
            }
            // TODO sort highscoreEntries
            popup.children().remove();
            popup.html(''); 
            var table = $('<table>');
            popup.append(table);
            var tr, td;
            for(var i=0; i < highscoreEntries.length; i++){
                tr = $('<tr>');
                table.append(tr);
                td = $('<td>');
                tr.append(td);
                td.append('' + highscoreEntries[i]);
            }
            popup.dialog('open');
            
            */
            
            
            
        });
    }
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

/*          
function debug(){      
    console.log(game.boards[0].ships);
}      

$('body').on('keydown', function(e){ 
    if(e.shiftKey && game.activeBoard)  
        if(game.currentPlayer)
if(game.currentPlayer.type == 'human')
    game.currentPlayer.flipShipsOrientation(false);
    if(e.keyCode == 82) // r
        if(game.currentPlayer)
if(game.currentPlayer.type == 'human')
    game.currentPlayer.btnCallback('random');
});
*/