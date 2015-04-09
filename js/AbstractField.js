
var cellStatus = {
    UNTOUCHED: 0,
    FIRED : 1,
    HIT : 2,
    DESTROYED : 3,
    ALLSHIPSDESTROYED : 4
}

var AbstractCell = function(row, col){
    this.row = row;
    this.col = col;
    this.status = cellStatus.UNTOUCHED;
}

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
        if(row > this.rows - 1 || col > this.cols - 1)
            return false;
        return this.cells[row * this.cols + col];
    },
    getCellStatus: function(row, col){
    	return this.getCellByRowCol(row, col).status;
    },
    setCellStatus: function(row, col, status){
    	var cell = this.getCellByRowCol(row, col);
    	cell.status = status;
    	this.lastTouchedCell = cell;
    },
    countFiredCells: function(){
    	var count = 0;
    	for(var i=0; i < this.cells.length; i++)
    		if(this.cells[i].status != cellStatus.UNTOUCHED)
    			count ++;
    	return count;
    }
}


    