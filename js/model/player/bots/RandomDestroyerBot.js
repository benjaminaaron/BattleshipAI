
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
        game.updatedBoard(UpdateReport.SHIPSWERERANDOMLYPLACED);
    },
    
    yourTurn: function(){
        AbstractBot.prototype.yourTurn.call(this);

        var lastTouchedCell = this.fieldMemory.lastTouchedCell;
        //TODO lastTouchedCells (plural) for cases when bonusTurns take place while a DestructionGoal is active or should be activated?

        if(lastTouchedCell){
            if(lastTouchedCell.status == CellStatus.HIT && this.goal == null)
                this.goal = new DestructionGoal(lastTouchedCell, this);
            if(lastTouchedCell.status == CellStatus.DESTROYED)
                this.goal = null;
        }

        if(this.goal)
            this.goal.think();
        else
            this.randomFire();
    }
}
