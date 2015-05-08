
var ZoningSquareDestroyerBot = function(name){
    AbstractBot.call(this, name);
    this.type = 'bot';

    this.goal = null;
}

ZoningSquareDestroyerBot.prototype = {
    __proto__: AbstractBot.prototype,

    yourSetup: function(){
        AbstractBot.prototype.yourSetup.call(this); 
        this.board.randomlyPlaceShips();  	
        viewModule.shipsWereRandomlyPlaced(this.ID);
    },
    yourTurn: function(){
        AbstractBot.prototype.yourTurn.call(this);

        var row, col;
        
        var lastTouchedCell = this.fieldMemory.lastTouchedCell;
        if(lastTouchedCell){
            if(lastTouchedCell.status == CellStatus.HIT && this.goal == null)
                this.goal = new DestructionGoal(lastTouchedCell, this);
            if(lastTouchedCell.status == CellStatus.DESTROYED)
                this.goal = null;
        }

        if(this.goal){
            this.goal.think();
        } else {
            var chosenCell = Zone.getCentreOfBiggestSquare(this.fieldMemory);
            var self = this;
            setTimeout(function(){
                self.fire(chosenCell.row, chosenCell.col);
            }, 10);    
        }
    }
}
