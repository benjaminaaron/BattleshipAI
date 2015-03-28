
var Game = function(players, shipTypes, xDim, yDim, canvasHook){
    canvasHook.innerHTML = '';

    this.players = players;

    var boardWidthPx = 400;
    var boardHeightPx = 300;

    for(var i=0; i < players.length; i++){
        var canvas = document.createElement("canvas");
        canvas.id = "canvas_" + i;
        canvas.width = boardWidthPx;
        canvas.height = boardHeightPx;
        canvasHook.appendChild(canvas);

        var board = new Board(i, players[i], shipTypes, canvas, xDim, yDim);

        players[i].board = board;
        board.draw();
        boards.push(board);
    }
    
    window.requestAnimationFrame(draw);
}

function getActiveBoard(){
    for(var i=0; i < boards.length; i++)
        if(boards[i].isActive)
            return boards[i];
    return false;
}

function draw(){  
    var board = getActiveBoard();
    if(board)
        board.draw();
}
