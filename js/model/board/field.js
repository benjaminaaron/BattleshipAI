
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
        for(var i=0; i < shipSize; i++){
            var cell = this.getCellByRowCol(rowHead + (orientation ? 0 : i), colHead + (orientation ? i : 0));
            if(cell.occupiedBy || cell.shipsInMyNeighbourhood != 0)
                return false;
        }
        return true; 
    },
    clearShadowCells: function(){ // not very effective to run through all
        for(var i=0; i < this.cells.length; i++)
            this.cells[i].hoveredBy = null;
    },
    updateValidShipPositionCells: function(cells, ship){ //occupy false means hovering     
        this.clearShadowCells();
        for(var i=0; i < cells.length; i++)
            cells[i].hoveredBy = ship;
        this.lastValidShipPositionCells = cells;
    },
    placeShipAtLastValidPosition: function(){
        if(this.lastValidShipPositionCells.length > 0){
            var firstCell = this.lastValidShipPositionCells[0];
            var ship = firstCell.hoveredBy;

            for(var i=0; i < this.lastValidShipPositionCells.length; i++){          
                var cell = this.lastValidShipPositionCells[i];
                cell.occupiedBy = ship;
                this.neighbourBlast(cell, 1);
            }
            ship.occupyingCells = this.lastValidShipPositionCells;    
            this.lastValidShipPositionCells = []; 
            this.clearShadowCells();
            return firstCell; //just need first field to place the ship correctly
        }
        else
            return null;  
    },
    neighbourBlast: function(cell, val){ // could surely be implemented better?
        var N  = this.getCellByRowCol(cell.row - 1, cell.col    ); // north
        var NE = this.getCellByRowCol(cell.row - 1, cell.col + 1); // north-east
        var E  = this.getCellByRowCol(cell.row,     cell.col + 1); //...
        var SE = this.getCellByRowCol(cell.row + 1, cell.col + 1); 
        var S  = this.getCellByRowCol(cell.row + 1, cell.col    ); 
        var SW = this.getCellByRowCol(cell.row + 1, cell.col - 1); 
        var W  = this.getCellByRowCol(cell.row,     cell.col - 1); 
        var NW = this.getCellByRowCol(cell.row - 1, cell.col - 1); 
        if(N)   N.shipsInMyNeighbourhood    += val;
        if(NE)  NE.shipsInMyNeighbourhood   += val;
        if(E)   E.shipsInMyNeighbourhood    += val;
        if(SE)  SE.shipsInMyNeighbourhood   += val;
        if(S)   S.shipsInMyNeighbourhood    += val;
        if(SW)  SW.shipsInMyNeighbourhood   += val;
        if(W)   W.shipsInMyNeighbourhood    += val;
        if(NW)  NW.shipsInMyNeighbourhood   += val;
    },
    clear: function(){
        for(var i=0; i < this.cells.length; i++){
            var cell = this.cells[i];
            cell.occupiedBy = null;
            cell.hoveredBy = null;
            cell.shipsInMyNeighbourhood = 0;
        }
    },
    toString: function(){
        var str = '';
        for(var i=0; i < this.cells.length; i++)
            str = str + '\n' + this.cells[i];
        return str;
    }
}
