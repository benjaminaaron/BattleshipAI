
var GridPos = function(orientation, row, col){
    this.orientation = orientation;
    this.row = row;
    this.col = col;
}

var Cell = function(row, col){
    this.id = row + '_' + col;
    this.row = row;
    this.col = col;
    this.occupiedBy = null;
    this.hoveredBy = null;
    this.shipsInMyNeighbourhood = 0;
    this.orientationWhileHovering = true;

    this.fired = false;
    this.fire = function(){
        this.fired = true;
        if(this.occupiedBy)
            return true;
        else
            return false;
    }

    this.toString = function(){
        return '(' + this.row + '/' + this.col + ') occupiedBy: [' + this.occupiedBy + '] all neighbour cells are free: ' + this.shipsInMyNeighbourhood;
    }
}


var Field = function(rows, cols, ctx, fieldLeft, fieldTop, cellSizePx){
    this.rows = rows;
    this.cols = cols;
    this.ctx = ctx;
    this.fieldLeft = fieldLeft;
    this.fieldTop = fieldTop;
    this.cellSizePx = cellSizePx;

    this.cells = [];
    for(var i = 0; i < rows; i++)
        for(var j = 0; j < rows; j++)
            this.cells.push(new Cell(i, j));

    this.shadowShipCells = [];
}

Field.prototype = {
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
    getCellByRowCol: function(row, col){
        if(row > this.rows - 1 || col > this.cols - 1)
            return false;
        return this.cells[row * this.cols + col];
    },
    allCellsFree: function(shipSize, orientation, rowHead, colHead){       
        for(var i=0; i < shipSize; i++){
            var cell = this.getCellByRowCol(rowHead + (orientation ? 0 : i), colHead + (orientation ? i : 0));
            if(cell.occupiedBy || cell.shipsInMyNeighbourhood != 0)
                return false;
        }
        return true; 
    },
    updateShadowCells: function(cells, ship){ //occupy false means hovering     
        if(!this.isSameCellBundle(this.shadowShipCells, cells))
            for(var i=0; i < this.shadowShipCells.length; i++) // means new position, therefore wipe old shadow position
                this.shadowShipCells[i].hoveredBy = null;
        for(var i=0; i < cells.length; i++)
            cells[i].hoveredBy = ship;
        if(cells.length > 0)
            cells[0].orientationWhileHovering = ship.orientation;
        this.shadowShipCells = cells;
    },
    placeLastShadowShipCells: function(){
        if(this.shadowShipCells.length > 0){
            var firstCell = this.shadowShipCells[0];
            var ship = firstCell.hoveredBy;

            for(var i=0; i < this.shadowShipCells.length; i++){          
                var cell = this.shadowShipCells[i];
                cell.occupiedBy = ship;
                cell.hoveredBy = null;   
                this.neighbourBlast(cell, 1);
            }
            ship.occupyingCells = this.shadowShipCells;    
            this.shadowShipCells = []; 
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
    isSameCellBundle: function(bundle1, bundle2){ //TODO beter way?
        if(bundle1.length == 0 || bundle2.length == 0)
            return false;
        if(bundle1.length == bundle2.length){
            for(var i=0; i < bundle1.length; i++)
                if(bundle1[i].id != bundle2[i].id)
                    return false;
            return true;
        }
        return false;
    },
    toString: function(){
        var str = '';
        for(var i=0; i < this.cells.length; i++)
            str = str + '\n' + this.cells[i];
        return str;
    }
}
