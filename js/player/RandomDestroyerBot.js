
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

var Dir = function(name, deltaRow, deltaCol){
    this.name = name;
    this.deltaRow = deltaRow;
    this.deltaCol = deltaCol;
    this.mulDeltaRow = function(fact){
        return this.deltaRow * fact;
    }
    this.mulDeltaCol = function(fact){
        return this.deltaCol * fact;
    }
    this.flip = function(){
        this.deltaRow *= -1;
        this.deltaCol *= -1;
    }
}

var DestructionGoal = function(cell, caller){
    this.cell = cell;
    this.caller = caller;
    this.fieldMemory = caller.fieldMemory;
    var rows = caller.board.rows;
    var cols = caller.board.cols; // 10x10

    var northDone = cell.row == 0 || this.fieldMemory.getCellByRowCol(cell.row - 1, cell.col).status == cellStatus.FIRED;
    var eastDone = cell.col == cols - 1 || this.fieldMemory.getCellByRowCol(cell.row, cell.col + 1).status == cellStatus.FIRED;
    var southDone = cell.row == rows - 1 || this.fieldMemory.getCellByRowCol(cell.row + 1, cell.col).status == cellStatus.FIRED;
    var westDone = cell.col == 0 || this.fieldMemory.getCellByRowCol(cell.row, cell.col - 1).status == cellStatus.FIRED;

    this.directions = [];
    if(!northDone)
        this.directions.push(new Dir('north', -1, 0));
    if(!eastDone)
        this.directions.push(new Dir('east', 0, 1));
    if(!southDone)
        this.directions.push(new Dir('south', 1, 0));
    if(!westDone)
        this.directions.push(new Dir('west', 0, -1));

    this.secondHitFound = false;
    this.lastDir = null;
    this.mulFact = 1;
}

DestructionGoal.prototype = {
    think: function(){

        var lastTouchedCell = this.fieldMemory.lastTouchedCell;

        if(this.cell != lastTouchedCell && lastTouchedCell.status == cellStatus.HIT){
            this.secondHitFound = true;
            console.log('2nd hit was in dir ' + this.lastDir.name);
        }

        if(!this.secondHitFound){
            var randIndex = Math.round(Math.random() * (this.directions.length - 1));
            var dir = this.directions[randIndex];
            this.lastDir = dir;
            this.directions.splice(randIndex, 1);
            var targetRow = this.cell.row + dir.deltaRow;
            var targetCol = this.cell.col + dir.deltaCol;
            this.fire(targetRow, targetCol);
        } else {

            var testTargetRow = this.cell.row + this.lastDir.mulDeltaRow(this.mulFact + 1);
            var testTargetCol = this.cell.col + this.lastDir.mulDeltaCol(this.mulFact + 1);
            var testTargetCell = this.fieldMemory.getCellByRowCol(testTargetRow, testTargetCol);

            if(lastTouchedCell.status != cellStatus.HIT || !testTargetCell){              
                this.lastDir.flip();
                this.mulFact = 0;
            } else {
                if(testTargetCell)
                    if(testTargetCell.status == cellStatus.FIRED){
                        this.lastDir.flip();
                        this.mulFact = 0;
                    }
            }

            this.mulFact ++;
            var targetRow = this.cell.row + this.lastDir.mulDeltaRow(this.mulFact);
            var targetCol = this.cell.col + this.lastDir.mulDeltaCol(this.mulFact);
            this.fire(targetRow, targetCol);
        }
    },
    fire: function(row, col){
        var self = this;
        setTimeout(function(){
            self.caller.fire(row, col);
        }, 10); 
    }
}
