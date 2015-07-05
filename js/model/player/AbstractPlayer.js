/**
 * Represents an abstract player instance (can be derived to a human or a bot player)..
 */

var AbstractPlayer = function(name){
    this.name = name;
    this.myTurn = false;
    this.inPlayPhase = false;
    this.opponent = null;
    this.shotcounter = 0;
    this.bonusShots = 0;
}

AbstractPlayer.prototype = {

    init: function(ID, board){
        this.ID = ID;
        this.board = board;
        this.canvas = board.canvas;
        this.fieldMemory = new FieldMemory(board.rows, board.cols);
    },

    setOpponent: function(opponent){
        this.opponent = opponent;
    },

    yourSetup: function(){
        this.myTurn = true;
        if(Driver.verboseLogging)
            console.log('>> i am setting up elements says ' + this.name);
    },

    finishedSetup: function(){
        //setting cells to wave, radiation and wave_radiation if applicable
        this.board.field.computeAttributes(this.board.elements);
        //console.log(this.board.field.toString());

        this.myTurn = false;
        // TODO warum wechseln wir in die playPhase, nur weil einmal finishedSetup aufgerufen wurde?
        // bezieht sich das nur auf den "player zustand?"
        this.inPlayPhase = true;
        if(Driver.verboseLogging)
            console.log('<< i am done setting up elements says ' + this.name);
        game.setupCompleted(this);
    },

    iAmDoneSettingUp: function() {
        if(Driver.verboseLogging)
            console.log(this);
        throw('Non-human players cannot call iAmDoneSettingUp!');
    },

    yourTurn: function(){
        this.myTurn = true;
        $('#container_' + this.id).addClass('activeContainer');
        if(Driver.verboseLogging)
            console.log('>> it\'s my turn says ' + this.name);
    },

    bonusTurn: function(){ // might cause weird stuff if a DestructionGoal is active while bonusTurns take place??
        this.myTurn = true;
        if(Driver.verboseLogging)
            console.log('>> it\'s my turn in a BONUS TURN says ' + this.name);
        this.randomFire();
    },

    fire: function(row, col){
        if(this.bonusShots == 0) //dont count those into the shotcounter, right?
            this.shotcounter ++;

        var resultMsg = game.fire(this, row, col);

        if(resultMsg.status != CellStatus.UNDEFINED)
            this.fieldMemory.incorporateFireResult(row, col, resultMsg, this.opponent.board.field);
        //console.log(this.fieldMemory.toString());

        this.finishedTurn();
    },

    finishedTurn: function(){
        this.myTurn = false;
        $('#container_' + this.id).removeClass('activeContainer');
        if(Driver.verboseLogging)
            console.log('<< my turn is over says ' + this.name);
        game.turnCompleted(this);
    },

    randomFire: function(){
        var untouchedCells = this.fieldMemory.getUntouchedCells();
        randomCell = untouchedCells[Math.floor(Math.random() * untouchedCells.length)];
        var self = this;
        setTimeout(function(){
            self.fire(randomCell.row, randomCell.col);
        }, 10);
    }

};
