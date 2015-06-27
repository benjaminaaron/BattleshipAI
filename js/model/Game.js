
var Game = function(players, shipTypes, viewModule){

    var board;

    this.viewModule = viewModule;
    this.rows = this.cols = 10;
    this.totalCells = this.rows * this.cols;
    this.totalShipCells = 0; // counting them for winning stats

    for(var i=0; i < shipTypes.length; i++)
        this.totalShipCells = this.totalShipCells + shipTypes[i].quantity * shipTypes[i].size;

    // PLAYER 0
    this.player0 = players[0];
    console.log(this.player0);
    board = new Board(0, this.player0, shipTypes, this.rows, this.cols);
    this.player0.init(0, board);

    // PLAYER 1
    this.player1 = players[1];
    board = new Board(1, this.player1, shipTypes, this.rows, this.cols);
    this.player1.init(1, board);

    // defining corresponding opponents
    this.player0.setOpponent(this.player1);
    this.player1.setOpponent(this.player0);  

    this.inPlayPhase = false;
    this.gameRunning = false;
    this.setCurrentPlayer(this.player0);
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
     * gets called by the canvas listeners installed during the installCanvasListener-method in GameView 
     * (TODO, that's not a proper separation of view & logic!)
     * @param eventType MouseEvent mousedown, -up or -move
     * @param ID of the board = ID of the board-owning player
     */
    handleCanvasEvent: function(eventType, ID, xMouse, yMouse){

        var eventOriginBoardOwner = ID == 0 ? this.player0 : this.player1;
        // TODO Was genau ist hier ein canvas event? Klick auf ein Feld?
        var sendCanvasEventToPlayer;

        // In playphase, canvas events are shots on the other player's board so the event needs to be directed
        // to the other player's board.
        // If not in playphase, canvas events are e.g. the placing of the elements and thus happen on the player's own board.
        if(this.inPlayPhase)
            sendCanvasEventToPlayer = this.currentPlayer != eventOriginBoardOwner;
        else
            sendCanvasEventToPlayer = this.currentPlayer == eventOriginBoardOwner;

        if(sendCanvasEventToPlayer){

            switch(eventType){

                case MouseEvent.MOUSEDOWN:
                    this.currentPlayer.mousedown(xMouse, yMouse);
                    break;
                case MouseEvent.MOUSEMOVE: 
                    this.currentPlayer.mousemove(xMouse, yMouse);
                    break;
                case MouseEvent.MOUSEUP:
                    this.currentPlayer.mouseup(xMouse, yMouse);
                    break;
                // TODO Default?
            }
        }
    },

    setCurrentPlayer: function(player){
        this.currentPlayer = player;
        //console.log(player);
    },
    
    /**
     * gets called by finishedSetup in AbstractPlayer, which gets called by iAmDoneSettingUp in Human 
     * or after the random setup from AbstractBot in yourSetup
     * @param caller is the person who is saying that they completed their setup
     */
    setupCompleted: function(caller){

        // waiting for other player to perform setup, otherwise starting the game
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

        if (fireResult.status == CellStatus.MINE) {
            caller.board.fire(row, col);
            console.log("Hit Mine, cell " + row + "/" + col + " of own field was shot!");
        }

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
            caller.opponent.board.loserBoard = true;
            caller.board.showShips = true;                  
            self.updatedBoard(UpdateReport.GAMECOMPLETED);
        }, 10);   
    }
}
