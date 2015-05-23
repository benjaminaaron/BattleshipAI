
var RandomBot = function(name){
    AbstractBot.call(this, name);
    this.type = 'bot';
}

RandomBot.prototype = {
    __proto__: AbstractBot.prototype,

    yourSetup: function(){
    	AbstractBot.prototype.yourSetup.call(this);
        this.board.randomlyPlaceShips();
        game.updatedBoard(UpdateReport.SHIPSWERERANDOMLYPLACED);
    },
    yourTurn: function(){
        AbstractBot.prototype.yourTurn.call(this);
        var row, col;
        var ok = false;
        while(!ok){
            row = Math.round(Math.random() * (game.rows - 1));
            col = Math.round(Math.random() * (game.cols - 1));
            ok = this.fieldMemory.getCellStatus(row, col) == CellStatus.UNTOUCHED;
        }
        var self = this;
        setTimeout(function(){
            self.fire(row, col);
        }, 10);    
    }
}
