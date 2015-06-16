
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
    getCellsAroundCellcluster: function(cellcluster){
        var head = cellcluster[0];
        var size = cellcluster.length;
        var orientation = head.row == cellcluster[1].row; //ehm, is that cool? why not...
        var neighbourCells = [];
        if(orientation){ 
            //west
            neighbourCells.push(this.getCellByRowCol(head.row, head.col - 1));
            //east
            neighbourCells.push(this.getCellByRowCol(head.row, head.col + size));
            //north and south
            for(var i=0; i < size + 2; i++){
                neighbourCells.push(this.getCellByRowCol(head.row - 1, head.col - 1 + i));
                neighbourCells.push(this.getCellByRowCol(head.row + 1, head.col - 1 + i));
            }
        } else {
            //north
            neighbourCells.push(this.getCellByRowCol(head.row - 1, head.col));
            //south
            neighbourCells.push(this.getCellByRowCol(head.row + size, head.col));
            //east and west
            for(var i=0; i < size + 2; i++){
                neighbourCells.push(this.getCellByRowCol(head.row - 1 + i, head.col - 1));
                neighbourCells.push(this.getCellByRowCol(head.row - 1 + i, head.col + 1));
            }
        }
        return neighbourCells;
    },
    setCellStatusesAroundShipToSpare: function(shipCode){
        var size = parseInt(shipCode.split('_')[0]);
        var orientation = shipCode.split('_')[1] == 'h';
        var headRow = parseInt(shipCode.split('_')[2].split('-')[0]);
        var headCol = parseInt(shipCode.split('_')[2].split('-')[1]);
        var deltaRow = orientation ? 0 : 1;
        var deltaCol = orientation ? 1 : 0;

        var cellcluster = [];
        for(var i=0; i < size; i++)
            cellcluster.push(this.getCellByRowCol(headRow + deltaRow * i, headCol + deltaCol * i));        

        var neighbourCells = this.getCellsAroundCellcluster(cellcluster);
        for(var i=0; i < neighbourCells.length; i++){
            var cell = neighbourCells[i];
            if(cell)
                if(cell.status == CellStatus.UNTOUCHED)
                    cell.status = CellStatus.SPARE;
        }
    }
}
