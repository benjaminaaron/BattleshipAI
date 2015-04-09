
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
            if(lastTouchedCell.status == cellStatus.HIT)
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

var Dir = function(name, deltaRow, deltaCol){
    this.name = name;
    this.deltaRow = deltaRow;
    this.deltaCol = deltaCol;
}

var DestructionGoal = function(cell, caller){
    this.cell = cell;
    this.fieldMemory = caller.fieldMemory;
    var rows = caller.board.rows;
    var cols = caller.board.cols; // 10x10

    var northDone = cell.row == 0;
    var eastDone = cell.col == cols - 1;
    var southDone = cell.row == rows - 1;
    var westDone = cell.col == 0;

    this.directions = [];
    if(!northDone)
        this.directions.push(new Dir('north', -1, 0));
    if(!eastDone)
        this.directions.push(new Dir('east', 0, 1));
    if(!southDone)
        this.directions.push(new Dir('south', 1, 0));
    if(!westDone)
        this.directions.push(new Dir('west', 0, -1));

    this.think();

/*    setTimeout(function(){
        caller.fire(row, col);
    }, 10);   */ 

}

DestructionGoal.prototype = {
    think: function(){

        var newDirections = []; //TOOD

        for(var i=0; i < this.directions.length; i++){
            var dir = this.directions[i];
            if(this.fieldMemory.getCellByRowCol(cell.row + dir.deltaRow, cell.col + dir.deltaCol).status == cellStatus.FIRED);
        }

    }
}
