
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
    },
    yourTurn: function(){
        AbstractBot.prototype.yourTurn.call(this);

        var row, col;
        
        var lastTouchedCell = this.fieldMemory.lastTouchedCell;
        if(lastTouchedCell){
            if(lastTouchedCell.status == cellStatus.HIT && this.goal == null)
                this.goal = new DestructionGoal(lastTouchedCell, this);
            if(lastTouchedCell.status == cellStatus.DESTROYED)
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
