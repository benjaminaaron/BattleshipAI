
var Cell  = function(row, col){
    this.row = row;
    this.col = col;
    this.occupied = null;
    this.toString = function(){
        return '(' + this.row + '/' + this.col + ')';
    }
}

var Field = function(totalRows, totalCols, xOffset, yOffset, cellSizePx){
    this.totalRows = totalRows;
    this.totalCols = totalCols;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.cellSizePx = cellSizePx;

    this.cells = [];
    for(var i = 0; i < totalRows; i++)
        for(var j = 0; j < totalRows; j++)
            this.cells.push(new Cell(i, j));
    
    this.occupiedFields = [];
    this.shipFloatingAboveCells = [];
}

Field.prototype = {
    draw: function(ctx){    

        //border around field
        ctx.strokeStyle = 'gray';  
        ctx.lineWidth = 2;

        ctx.rect(this.xOffset, this.yOffset, this.totalCols * this.cellSizePx, this.totalRows * this.cellSizePx);
        ctx.stroke();

        // grid & labels
        ctx.strokeStyle = 'silver'; 
        ctx.lineWidth = 1;
        ctx.fillStyle = 'gray';
        ctx.font = '12px arial';           
        for(var i=0; i <= this.totalRows; i++){
            var yPos = this.yOffset + i * this.cellSizePx;
            ctx.beginPath();
            ctx.moveTo(this.xOffset, yPos);
            ctx.lineTo(this.xOffset + this.totalCols * this.cellSizePx, yPos);
            ctx.stroke();
            if(i < this.totalRows)
                ctx.fillText((i+1), this.xOffset + ((i+1) < 10 ? -16 : -20), yPos + 14);
        }
        for(var i=0; i <= this.totalCols; i++){
            var xPos = this.xOffset + i * this.cellSizePx;
            ctx.beginPath();
            ctx.moveTo(xPos, this.yOffset);
            ctx.lineTo(xPos, this.yOffset + this.totalRows * this.cellSizePx);
            ctx.stroke();
            if(i < this.totalCols)
                ctx.fillText(String.fromCharCode('A'.charCodeAt() + i), xPos + 6, this.yOffset - 8);     
        }

        ctx.fillStyle = 'silver';    
        for(var i=0; i < this.shipFloatingAboveCells.length; i++){
            var cell = this.shipFloatingAboveCells[i]
            ctx.fillRect(this.xOffset + cell.col * this.cellSizePx, this.yOffset + cell.row * this.cellSizePx, this.cellSizePx, this.cellSizePx);
        }

    },
    reportingShipMovement: function(ship){
        var size = ship.size;
        var orientation = ship.orientation;
        var x = ship.x - this.xOffset;
        var y = ship.y - this.yOffset;

        if(orientation){
            var col = Math.round(x / this.cellSizePx);
            var row = Math.round(y / this.cellSizePx);
            //console.log(row + '  ' + col);
        } else {
            var col = Math.round(x / this.cellSizePx);
            var row = Math.round(y / this.cellSizePx);
            //console.log(row + '  ' + col);
        }
        
        this.shipFloatingAboveCells = [];
        var isOk = true;
        for(var i=0; i < size; i++){
            var cell = this.getCellByRowCol(row + (orientation ? 0 : i), col + (orientation ? i : 0));
            this.shipFloatingAboveCells.push(cell);
            if(cell.occupied != null)
                isOk = false;
        }
        if(!isOk)
            this.shipFloatingAboveCells = [];
    },
    reportingShipPlacement: function(ship){
/*       
        if(this.shipFloatingAboveCells.length > 0){
            for(var i=0; i < this.shipFloatingAboveCells.length; i++)
                this.shipFloatingAboveCells[i].occupied = ship;
            ship.x = this.xOffset + this.shipFloatingAboveCells[0].col * this.cellSizePx;
            ship.y = this.yOffset + this.shipFloatingAboveCells[0].row * this.cellSizePx;
        }
*/        
    },
    getCellByRowCol: function(row, col){
        return this.cells[row * this.totalCols + col];;
    }
}
