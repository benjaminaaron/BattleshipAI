
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
    this.orientationWhileHovering = true;
    this.toString = function(){
        return '(' + this.row + '/' + this.col + ')';
    }
}

var Field = function(totalRows, totalCols){
    this.totalRows = totalRows;
    this.totalCols = totalCols;
    this.cells = [];
    for(var i = 0; i < totalRows; i++)
        for(var j = 0; j < totalRows; j++)
            this.cells.push(new Cell(i, j));
    this.cellBundleMemory = [];
}

Field.prototype = {
    draw: function(ctx, xOffset, yOffset, cellSizePx){    

        //border around field
        ctx.strokeStyle = 'gray';  
        ctx.lineWidth = 2;
        ctx.rect(xOffset, yOffset, this.totalCols * cellSizePx, this.totalRows * cellSizePx);
        ctx.stroke();

        // grid & labels
        ctx.strokeStyle = 'silver'; 
        ctx.lineWidth = 1;
        ctx.fillStyle = 'gray';
        ctx.font = '12px arial';           
        for(var i=0; i <= this.totalRows; i++){
            var yPos = yOffset + i * cellSizePx;
            ctx.beginPath();
            ctx.moveTo(xOffset, yPos);
            ctx.lineTo(xOffset + this.totalCols * cellSizePx, yPos);
            ctx.stroke();
            if(i < this.totalRows)
                ctx.fillText((i+1), xOffset + ((i+1) < 10 ? -16 : -20), yPos + 14);
        }
        for(var i=0; i <= this.totalCols; i++){
            var xPos = xOffset + i * cellSizePx;
            ctx.beginPath();
            ctx.moveTo(xPos, yOffset);
            ctx.lineTo(xPos, yOffset + this.totalRows * cellSizePx);
            ctx.stroke();
            if(i < this.totalCols)
                ctx.fillText(String.fromCharCode('A'.charCodeAt() + i), xPos + 6, yOffset - 8);     
        }

        // cell coloring for hovered cells
        for(var i=0; i < this.cells.length; i++){
            var cell = this.cells[i];
            if(cell.hoveredBy != null){
                ctx.fillStyle = 'silver';    
                ctx.fillRect(xOffset + cell.col * cellSizePx, yOffset + cell.row * cellSizePx, cellSizePx, cellSizePx);
            }
        }
    },
    getCellByRowCol: function(row, col){
        return this.cells[row * this.totalCols + col];;
    },
    cellBundleHoverAction: function(cells, ship){ //occupy false means hovering     
        if(!this.isSameCellBundle(this.cellBundleMemory, cells))
            for(var i=0; i < this.cellBundleMemory.length; i++)
                this.cellBundleMemory[i].hoveredBy = null;
        for(var i=0; i < cells.length; i++){
            cells[i].hoveredBy = ship;
            cells[i].orientationWhileHovering = ship.orientation;
        }
        this.cellBundleMemory = cells;
    },
    placeLastCellBundleMemory: function(){
        if(this.cellBundleMemory.length > 0){
            var ship = this.cellBundleMemory[0].hoveredBy;
            for(var i=0; i < this.cellBundleMemory.length; i++){
                var cell = this.cellBundleMemory[i];
                cell.occupiedBy = ship;
                cell.hoveredBy = null;
            }
            ship.occupyingCells = this.cellBundleMemory;
            var firstCell = this.cellBundleMemory[0];
            this.cellBundleMemory = []; 
            return firstCell; //just need first field to place the ship correctly
        }
        else
            return null;  
    },
    isSameCellBundle: function(bundle1, bundle2){ 
        if(bundle1.length == 0 || bundle2.length == 0)
            return false;
        if(bundle1.length == bundle2.length){
            for(var i=0; i < bundle1.length; i++)
                if(bundle1[i].id != bundle2[i].id)
                    return false;
            return true;
        }
        return false;
    }
}
