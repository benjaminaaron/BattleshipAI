
var Game = function(players, shipTypes, xDim, yDim, canvasHook){
    canvasHook.innerHTML = '';

    this.players = players;

    var boardWidthPx = 400;
    var boardHeightPx = 300;

    this.boards = [];
    this.activeBoard = null;

    for(var i=0; i < players.length; i++){
        var canvas = document.createElement("canvas");
        canvas.id = "canvas_" + i;
        canvas.width = boardWidthPx;
        canvas.height = boardHeightPx;
        canvasHook.appendChild(canvas);

        var board = new Board(i, players[i], shipTypes, canvas, xDim, yDim);

        players[i].board = board;
        board.draw();
        this.boards.push(board);
    }

    this.initDrawDone = false;
}

Game.prototype = {
    draw: function(){
        if(!this.initDrawDone){
            for(var i=0; i < this.boards.length; i++)
                this.boards[i].draw();
            this.initDrawDone = true;
        }

        this.activeBoard = this.getActiveBoard();
        
        if(this.activeBoard != null){
            this.activeBoard.draw();
            animate = true;
        }
        else
            animate = false;
    },
    getActiveBoard: function(){
        for(var i=0; i < this.boards.length; i++)
            if(this.boards[i].drawMe || this.boards[i].oneMoreDraw){
                this.boards[i].oneMoreDraw = false;
                return this.boards[i];
            }
        return null;
    }
}

function initDraw(){
    window.requestAnimationFrame(draw);
}

function draw(){
    //console.log('draw called');
    game.draw();
    if(animate)
        window.requestAnimationFrame(draw);
}
