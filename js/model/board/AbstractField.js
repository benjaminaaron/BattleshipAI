
var AbstractField = function(rows, cols){
    this.rows = rows;
    this.cols = cols;

    this.cells = [];
    for(var i = 0; i < rows; i++)
        for(var j = 0; j < cols; j++)
            this.cells.push(new AbstractCell(i, j));

    this.lastTouchedCell = null;
}

AbstractField.prototype = {
	getCellByRowCol: function(row, col){
        if(row > this.rows - 1 || row < 0 || col > this.cols - 1 || col < 0)
            return false;
        return this.cells[row * this.cols + col];
    },
    getCellStatus: function(row, col){
    	return this.getCellByRowCol(row, col).status;
    },
    cellIsExistingAndUntouched: function(row, col){
        var cell = this.getCellByRowCol(row, col);
        if(cell)
            if(cell.status == CellStatus.UNTOUCHED)
                return cell;
        return false;
        //console.log('cell ' + row + '/' + col + ' is being checked - is ' + returnVal);
    },
    setCellStatus: function(row, col, status){
    	var cell = this.getCellByRowCol(row, col);    
    	cell.status = status;
    	this.lastTouchedCell = cell;
    },
    countFiredCells: function(){
    	var count = 0;
    	for(var i=0; i < this.cells.length; i++)
    		if(this.cells[i].status == CellStatus.HIT || this.cells[i].status == CellStatus.DESTROYED || this.cells[i].status == CellStatus.FIRED)
    			count ++;
    	return count;
    },
    getUntouchedCells: function(){
        var cells = [];
        for(var i=0; i < this.cells.length; i++)
            if(this.cells[i].status == CellStatus.UNTOUCHED)
                cells.push(this.cells[i]);
        return cells;
    },
    setCellStatusesAroundShipToSpare: function(ship){
        var firstCell = ship.occupyingCells[0];
        var neighbourCells = [];
        if(ship.orientation){ 
            //west
            neighbourCells.push(this.getCellByRowCol(firstCell.row, firstCell.col - 1));
            //east
            neighbourCells.push(this.getCellByRowCol(firstCell.row, firstCell.col + ship.size));
            //north and south
            for(var i=0; i < ship.size + 2; i++){
                neighbourCells.push(this.getCellByRowCol(firstCell.row - 1, firstCell.col - 1 + i));
                neighbourCells.push(this.getCellByRowCol(firstCell.row + 1, firstCell.col - 1 + i));
            }
        } else {
            //north
            neighbourCells.push(this.getCellByRowCol(firstCell.row - 1, firstCell.col));
            //south
            neighbourCells.push(this.getCellByRowCol(firstCell.row + ship.size, firstCell.col));
            //east and west
            for(var i=0; i < ship.size + 2; i++){
                neighbourCells.push(this.getCellByRowCol(firstCell.row - 1 + i, firstCell.col - 1));
                neighbourCells.push(this.getCellByRowCol(firstCell.row - 1 + i, firstCell.col + 1));
            }
        }
        for(var i=0; i < neighbourCells.length; i++){
            var cell = neighbourCells[i];
            if(cell)
                if(cell.status == CellStatus.UNTOUCHED)
                    cell.status = CellStatus.SPARE;
        }
    }
}
