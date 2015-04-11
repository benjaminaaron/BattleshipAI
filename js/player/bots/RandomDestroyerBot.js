
var RandomDestroyerBot = function(name){
    AbstractBot.call(this, name);
    this.type = 'bot';

    this.goal = null;
}

RandomDestroyerBot.prototype = {
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
            var ok = false;
            while(!ok){
                row = Math.round(Math.random() * (game.rows - 1));
                col = Math.round(Math.random() * (game.cols - 1));
                ok = this.fieldMemory.getCellStatus(row, col) == cellStatus.UNTOUCHED;
            }
            var self = this;
            setTimeout(function(){
                self.fire(row, col);
            }, 10);    
        }
    }
}
