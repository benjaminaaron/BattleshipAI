/**
 * Represents an abstract player instance (can be derived to a human or a bot player)..
 */

var AbstractPlayer = function(name){
    this.name = name;
    this.myTurn = false;
    this.inPlayPhase = false;
    this.opponent = null;
}

AbstractPlayer.prototype = {
    init: function(ID, board){
        this.ID = ID;
        this.board = board;
        this.canvas = board.canvas;
        this.fieldMemory = new AbstractField(board.rows, board.cols); 
    },
    setOpponent: function(opponent){
        this.opponent = opponent;
    },
    yourSetup: function(){
        this.myTurn = true;
        //$('#container_' + this.id).addClass('activeContainer');    
        console.log('>> i am setting up ships says ' + this.name);
    },
    finishedSetup: function(){
        this.myTurn = false;
        this.inPlayPhase = true;
        //$('#container_' + this.id).removeClass('activeContainer');    
        console.log('<< i am done setting up ships says ' + this.name);        
        game.setupCompleted(this);
    },
    yourTurn: function(){
        this.myTurn = true;
        $('#container_' + this.id).addClass('activeContainer');    
        console.log('>> it\'s my turn says ' + this.name);
    },
    fire: function(row, col){
        var resultMsg = game.fire(this, row, col);
        var result = resultMsg.status;
        console.log(this.name + ' CellStatus after shot:');
        switch(result){
            case CellStatus.FIRED:
                console.log('no hit');
                break;
            case CellStatus.HIT:
                console.log('hit');
                break;
            case CellStatus.DESTROYED:
                console.log('destroyed');
                this.fieldMemory.setCellStatusesAroundShipToWave(resultMsg.destroyedShipCode);
                //console.log(this.fieldMemory);
                if(resultMsg.allShipsDestroyed){
                    console.log('all ships destroyed');
                    game.iWon(this, this.fieldMemory.countFiredCells() + 1); 
                }
                break;
        }
        this.fieldMemory.setCellStatus(row, col, result);
        this.finishedTurn();
    },
    finishedTurn: function(){
        this.myTurn = false;
        $('#container_' + this.id).removeClass('activeContainer');    
        console.log('<< my turn is over says ' + this.name);
        game.turnCompleted(this);
    }
};