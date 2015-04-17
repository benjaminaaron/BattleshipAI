
var Game = function(player0, player1, shipTypes, viewModule){
    this.viewModule = viewModule;
    this.rows = 10;
    this.cols = 10;
    this.boards = [];

    this.totalCells = this.rows * this.cols;
    this.totalShipCells = 0; // counting them for winning stats
    for(var i=0; i < shipTypes.length; i++)
        this.totalShipCells = this.totalShipCells + shipTypes[i].quantity * shipTypes[i].size;

    // PLAYER 0
    var board = new Board(0, player0, shipTypes, this.rows, this.cols);
    player0.init(0, board);
    this.boards.push(board);
    this.player0 = player0;
    player0.setOpponent(player0); // single player case

    // PLAYER 1
    if(player1){
        board = new Board(1, player1, shipTypes, this.rows, this.cols);
        player1.init(1, board);
        this.boards.push(board);
        this.player1 = player1;
        player0.setOpponent(player1);
        player1.setOpponent(player0);
    }    

    this.isSingleGame = this.player1 == null;
    this.inPlayPhase = false;
    this.currentPlayer = player0;
    this.gameRunning = false;
    this.updatedBoard(UpdateReport.INIT);
}

Game.prototype = {
    start: function(){
        this.gameRunning = true;
        this.currentPlayer.yourSetup(); 
    },
    updatedBoard: function(updateReport){
        viewModule.handleUpdatedBoard(updateReport);
    },
    handleCanvasEvent: function(type, id, xMouse, yMouse){
        var player = this.currentPlayer;
        var eventOriginBoardOwner = id == 0 ? this.player0 : this.player1;

        var sendCanvasEventToPlayer;
        if(!this.inPlayPhase)
            sendCanvasEventToPlayer = player == eventOriginBoardOwner;
        else
            if(this.isSingleGame)
                sendCanvasEventToPlayer = true;
            else
                sendCanvasEventToPlayer = player != eventOriginBoardOwner;

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
    setCurrentPlayer: function(player){
        this.currentPlayer = player;
        //this.viewModule.currentPlayer = player;
    },
    setupCompleted: function(caller){
        if(this.isSingleGame){
            $('#statusLabel').html('in <b>play phase</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
            this.inPlayPhase = true;
            this.currentPlayer.yourTurn();
        } else {
            if(caller.id == 0){
                this.setCurrentPlayer(this.player1);
                this.currentPlayer.yourSetup(); 
            } else {
                this.inPlayPhase = true;
                $('#statusLabel').html('in <b>play phase</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
                this.setCurrentPlayer(this.player0);
                this.currentPlayer.yourTurn(); 
            }
        }
        this.updatedBoard(UpdateReport.ONESETUPCOMPLETED);
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
                    this.setCurrentPlayer(this.player1);
                    this.currentPlayer.yourTurn();
                } else {
                    this.setCurrentPlayer(this.player0);
                    this.currentPlayer.yourTurn(); 
                }
            }
        }
        this.updatedBoard(UpdateReport.ONETURNCOMPLETED);
    },
    iWon: function(caller, shotsFired){
        this.gameRunning = false;
        var self = this;
        setTimeout(function(){
            $('#statusLabel').html('<b>' + caller.name + ' won!</b>&nbsp;&nbsp;&nbsp;' + shotsFired + ' (' + game.totalShipCells + '-' + game.totalCells + ')&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'); 
            caller.board.winnerBoard = true;
            caller.opponent.board.looserBoard = true;  
            if(!self.isSingleGame && firebase){
                firebase.push({
                    timestamp: getFormattedDate(),
                    player0: self.player0.name,
                    player1: self.player1.name,
                    winner: caller.id,
                    shots: shotsFired
                });
            }
            self.updatedBoard(UpdateReport.GAMECOMPLETED);
        }, 10);   
    }
}
