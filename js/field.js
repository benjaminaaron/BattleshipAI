
var ShipPos = function(orientation, row, col){
    this.orientation = orientation;
    this.row = row;
    this.col = col;
}

var Cell = function(row, col){
    AbstractCell.call(this, row, col);
    this.id = row + '_' + col;

    this.occupiedBy = null;
    this.hoveredBy = null;
    this.shipsInMyNeighbourhood = 0;
    
    this.fired = false;
    this.fire = function(){
        if(this.fired){
            //return cellStatus.ALREADYSHOT;
        }
        else {
            this.fired = true;
            var ship = this.occupiedBy;
            if(ship)
                return ship.fire();
            else
                return cellStatus.FIRED;
        }
    };
    this.toString = function(){
        return '(' + this.row + '/' + this.col + ') occupiedBy: [' + this.occupiedBy + '] all neighbour cells are free: ' + this.shipsInMyNeighbourhood;
    };
}


var Field = function(rows, cols, ctx, fieldLeft, fieldTop, cellSizePx){
    AbstractField.call(this, rows, cols);

    this.ctx = ctx;
    this.fieldLeft = fieldLeft;
    this.fieldTop = fieldTop;
    this.cellSizePx = cellSizePx;

    this.cells = [];
    for(var i = 0; i < rows; i++)
        for(var j = 0; j < cols; j++)
            this.cells.push(new Cell(i, j)); //solve better with AbstractField/Cell

    this.lastValidShipPositionCells = [];
}

Field.prototype = {
    __proto__: AbstractField.prototype,

    draw: function(){    
        var ctx = this.ctx;
        var fieldLeft = this.fieldLeft;
        var fieldTop = this.fieldTop;
        var cellSizePx = this.cellSizePx;

        //border around field
        ctx.strokeStyle = 'gray';  
        ctx.lineWidth = 2;
        ctx.rect(fieldLeft, fieldTop, this.cols * cellSizePx, this.rows * cellSizePx);
        ctx.stroke();

        // grid & labels
        ctx.strokeStyle = 'silver'; 
        ctx.lineWidth = 1;
        ctx.fillStyle = 'gray';
        ctx.font = '12px arial';           
        for(var i=0; i <= this.rows; i++){
            var yPos = fieldTop + i * cellSizePx;
            ctx.beginPath();
            ctx.moveTo(fieldLeft, yPos);
            ctx.lineTo(fieldLeft + this.cols * cellSizePx, yPos);
            ctx.stroke();
            if(i < this.rows)
                ctx.fillText((i+1), fieldLeft + ((i+1) < 10 ? -16 : -20), yPos + 14);
        }
        for(var i=0; i <= this.cols; i++){
            var xPos = fieldLeft + i * cellSizePx;
            ctx.beginPath();
            ctx.moveTo(xPos, fieldTop);
            ctx.lineTo(xPos, fieldTop + this.rows * cellSizePx);
            ctx.stroke();
            if(i < this.cols)
                ctx.fillText(String.fromCharCode('A'.charCodeAt() + i), xPos + 6, fieldTop - 8);     
        }

        // cell coloring for hovered cells
        for(var i=0; i < this.cells.length; i++){
            var cell = this.cells[i];
            if(cell.hoveredBy){
                ctx.fillStyle = 'silver';    
                ctx.fillRect(fieldLeft + cell.col * cellSizePx, fieldTop + cell.row * cellSizePx, cellSizePx, cellSizePx);
            }
        }
    },
    drawHits: function(){
        var ctx = this.ctx;
        var fieldLeft = this.fieldLeft;
        var fieldTop = this.fieldTop;
        var cellSizePx = this.cellSizePx;
        var a = cellSizePx / 2 - 4;
        ctx.strokeStyle = 'black'; 
        ctx.fillStyle = 'black';
        ctx.lineWidth = 2;

        for(var i=0; i < this.cells.length; i++){
            var cell = this.cells[i];
            var xMiddle = fieldLeft + cell.col * cellSizePx + cellSizePx / 2;
            var yMiddle = fieldTop + cell.row * cellSizePx + cellSizePx / 2;
            if(cell.fired)
                if(cell.occupiedBy == null){
                    ctx.beginPath();
                    ctx.arc(xMiddle, yMiddle, a / 2, 0, Math.PI*2); 
                    ctx.closePath();
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.moveTo(xMiddle - a, yMiddle - a);
                    ctx.lineTo(xMiddle + a, yMiddle + a);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(xMiddle - a, yMiddle + a);
                    ctx.lineTo(xMiddle + a, yMiddle - a);
                    ctx.stroke();
                }
        }
    },
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
