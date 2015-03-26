

var Game = function(players, shipTypes){
    var gameHook = document.getElementById('gameHook');
    gameHook.innerHTML = '';

    this.players = players;
    this.boards = [];

    var boardWidth = 400;
    var boardHeight = 300;

    for(var i=0; i < players.length; i++){
        var board = new Board(i, players[i], shipTypes);
        board.draw(gameHook, boardWidth, boardHeight);
        players[i].board = board;
        this.boards.push(board);
    }
}