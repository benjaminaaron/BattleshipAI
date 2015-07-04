
var ZoningRectDestroyerBot = function(name){
    AbstractBot.call(this, name);
    this.type = 'bot';
    this.goal = null;
}

ZoningRectDestroyerBot.prototype = {
    __proto__: AbstractBot.prototype,

    yourSetup: function(){
        AbstractBot.prototype.yourSetup.call(this);
        this.board.randomlyPlaceShips();
        game.updatedBoard(UpdateReport.SHIPSWERERANDOMLYPLACED);
    },
    yourTurn: function(){
        AbstractBot.prototype.yourTurn.call(this);

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
            var chosenCell = Zone.getCentreOfBiggestRect(this.fieldMemory);
            var self = this;
            setTimeout(function(){
                self.fire(chosenCell.row, chosenCell.col);
            }, 10);
        }
    }
}
