
var Game = function(player0, player1, shipTypes, viewModule){
    this.viewModule = viewModule;
    this.rows = 10;
    this.cols = 10;

    this.totalCells = this.rows * this.cols;
    this.totalShipCells = 0; // counting them for winning stats
    for(var i=0; i < shipTypes.length; i++)
        this.totalShipCells = this.totalShipCells + shipTypes[i].quantity * shipTypes[i].size;

    // PLAYER 0
    var board = new Board(0, player0, shipTypes, this.rows, this.cols);
    player0.init(0, board);
    this.player0 = player0;

    // PLAYER 1
    board = new Board(1, player1, shipTypes, this.rows, this.cols);
    player1.init(1, board);
    this.player1 = player1;

    player0.setOpponent(player1);
    player1.setOpponent(player0);  

    this.inPlayPhase = false;
    this.currentPlayer = player0;
    this.gameRunning = false;
}

Game.prototype = {
    start: function(){
        this.gameRunning = true;
        this.currentPlayer.yourSetup();
    },
    updatedBoard: function(updateReport){
        viewModule.handleUpdatedBoard(updateReport, this.currentPlayer.ID);
    },
    
    /**
     * gets called by the canvas listeners installed during the installCanvasListener-method in GameView (TODO, that's not a proper separation of view & logic!)
     * @param type MouseEvent mousedown, -up or -move
     * @param ID of the board = ID of the board-owning player
     */
    handleCanvasEvent: function(type, ID, xMouse, yMouse){
        var player = this.currentPlayer;
        var eventOriginBoardOwner = ID == 0 ? this.player0 : this.player1;

        var sendCanvasEventToPlayer;
        if(!this.inPlayPhase)
            sendCanvasEventToPlayer = player == eventOriginBoardOwner;
        else
            sendCanvasEventToPlayer = player != eventOriginBoardOwner;

        if(sendCanvasEventToPlayer){
            switch(type){
                case MouseEvent.MOUSEDOWN:
                    player.mousedown(xMouse, yMouse);
                    break;
                case MouseEvent.MOUSEMOVE: 
                    player.mousemove(xMouse, yMouse);
                    break;
                case MouseEvent.MOUSEUP:
                    player.mouseup(xMouse, yMouse);
                    break;
            }
        }
    },
    setCurrentPlayer: function(player){
        this.currentPlayer = player;
    },
    
    /**
     * gets called by finishedSetup in AbstractPlayer, which gets called by iAmDoneSettingUp in Human or after the random setup from AbstractBot in yourSetup
     * @param caller is the person who is saying that they completed their setup
     */
    setupCompleted: function(caller){
        if(caller.ID == 0){
            this.setCurrentPlayer(this.player1);
            this.currentPlayer.yourSetup(); 
        } else {
            this.inPlayPhase = true;
            $('#readyBtn').hide();
            $('#statusLabel').html('in <b>play phase</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
            this.setCurrentPlayer(this.player0);
            this.currentPlayer.yourTurn(); 
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
            if(caller.ID == 0){
                this.setCurrentPlayer(this.player1);
                this.currentPlayer.yourTurn();
            } else {
                this.setCurrentPlayer(this.player0);
                this.currentPlayer.yourTurn(); 
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
            caller.board.showShips = true;                  
            self.updatedBoard(UpdateReport.GAMECOMPLETED);
        }, 10);   
    }
}
