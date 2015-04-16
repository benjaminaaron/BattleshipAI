
var Field = function(rows, cols){
    AbstractField.call(this, rows, cols);

    this.cells = [];
    for(var i = 0; i < rows; i++)
        for(var j = 0; j < cols; j++)
            this.cells.push(new Cell(i, j)); //solve better with AbstractField/Cell

    this.lastValidShipPositionCells = [];
}

Field.prototype = {
    __proto__: AbstractField.prototype,
    allCellsFree: function(shipSize, orientation, rowHead, colHead){         
        var cellcluster = [];
        for(var i=0; i < shipSize; i++){
            var cell = this.getCellByRowCol(rowHead + (orientation ? 0 : i), colHead + (orientation ? i : 0));
            if(cell.occupiedBy)
                return false;
            cellcluster.push(cell);
        }    
        var neighbourCells = this.getCellsAroundCellcluster(cellcluster);
        for(var i=0; i < neighbourCells.length; i++)
            if(neighbourCells[i].occupiedBy)
                return false;
        return true; 
    },
    placeShipAtLastValidPosition: function(ship, fieldLeft, fieldTop, cellSizePx){
        var cells = this.lastValidShipPositionCells;
        if(cells.length > 0){
            for(var i=0; i < cells.length; i++)          
                cells[i].occupiedBy = ship;

            ship.occupyingCells = cells;    
            this.lastValidShipPositionCells = []; 

            var headCell = cells[0];
            ship.x = fieldLeft + headCell.col * cellSizePx;
            ship.y = fieldTop + headCell.row * cellSizePx;
        }
    },
    clear: function(){
        for(var i=0; i < this.cells.length; i++)
            this.cells[i].occupiedBy = null;
    },
    toString: function(){
        var str = '';
        for(var i=0; i < this.cells.length; i++)
            str = str + '\n' + this.cells[i];
        return str;
    }
}
