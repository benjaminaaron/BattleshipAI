
var Game = function(player0, player1, shipTypes, rows, cols, gameHook){
    this.rows = rows;
    this.cols = cols;
    this.boards = [];

    this.totalCells = rows * cols;
    this.totalShipCells = 0; // counting them for winning stats
    for(var i=0; i < shipTypes.length; i++)
        this.totalShipCells = this.totalShipCells + shipTypes[i].quantity * shipTypes[i].size;

    // PLAYER 0
    var container = $('<div>').attr({
        'id': 'container_0',
        'class': 'container'
    });
    $(gameHook).append(container);
    var board = new Board(0, container, player0, shipTypes, rows, cols);
    player0.init(0, board);
    this.boards.push(board);
    this.player0 = player0;
    player0.setOpponent(player0); // own one

    // PLAYER 1
    if(player1){
        container = $('<div>').attr({
            'id': 'container_1',
            'class': 'container'
        });
        $(gameHook).append(container);
        board = new Board(1, container, player1, shipTypes, rows, cols);
        player1.init(1, board);
        this.boards.push(board);
        this.player1 = player1;

        player0.setOpponent(player1);
        player1.setOpponent(player0);
    }    

    this.isSingleGame = this.player1 == null;
    this.inPlayPhase = false;
    draw();
    this.currentPlayer = player0;
    this.currentPlayer.yourSetup(); 
    this.gameRunning = true;
}

Game.prototype = {
    draw: function(){          
        for(var i=0; i < this.boards.length; i++)
            this.boards[i].draw();     
    },
    handleCanvasEvent: function(board, type, e){
        var canvasElement = board.canvas.getBoundingClientRect();
        var xMouse = e.originalEvent.pageX - canvasElement.left;
        var yMouse = e.originalEvent.pageY - canvasElement.top;

        var player = this.currentPlayer;

        var sendCanvasEventToPlayer;
        if(!this.inPlayPhase)
            sendCanvasEventToPlayer = player.board == board;
        else
            if(this.isSingleGame)
                sendCanvasEventToPlayer = true;
            else
                sendCanvasEventToPlayer = player.board != board;

        if(sendCanvasEventToPlayer){
            switch(type){
                case 0:
                    player.mousedown(xMouse, yMouse);
                    break;
                case 1: 
                    player.mousemove(xMouse, yMouse);
                    break;
                case 2:
                    player.mouseup(xMouse, yMouse);
                    break;
            }
        }
    },
    setupCompleted: function(caller){
        if(this.isSingleGame){
            $('#statusLabel').html('in <b>play phase</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
            this.inPlayPhase = true;
            this.currentPlayer.yourTurn();
        } else {
            if(caller.id == 0){
                this.currentPlayer = this.player1;
                this.currentPlayer.yourSetup(); 
            } else {
                this.inPlayPhase = true;
                $('#statusLabel').html('in <b>play phase</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
                this.currentPlayer = this.player0;
                this.currentPlayer.yourTurn(); 
            }
        }
    },
    fire: function(caller, row, col){
        var targetBoard = caller.opponent.board;
        var fireResult = targetBoard.fire(row, col);
        return fireResult;
    },
    turnCompleted: function(caller){
        if(this.gameRunning){
            if(this.isSingleGame)
                this.currentPlayer.yourTurn();
            else {
                if(caller.id == 0){
                    this.currentPlayer = this.player1;
                    this.currentPlayer.yourTurn();
                } else {
                    this.currentPlayer = this.player0;
                    this.currentPlayer.yourTurn(); 
                }
            }
        }
    },
    iWon: function(caller){
        this.gameRunning = false;
        setTimeout(function(){
            $('#statusLabel').html('<b>' + caller.name + ' won!</b>&nbsp;&nbsp;&nbsp;' + caller.firedMemory.length + ' (' + game.totalShipCells + '-' + game.totalCells + ')&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'); 
            caller.board.winnerBoard = true;
            caller.opponent.board.looserBoard = true;  
            draw(); 
        }, 10);  
    }
}
