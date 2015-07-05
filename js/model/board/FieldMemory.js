
/**
 * Holds the actual cells where shots are directed at and elements are placed on.
 * Is used for storing data about the opponent's field.'
 * Provides methods for cell manipulation.
 */
var FieldMemory = function(rows, cols){
    this.rows = rows;
    this.cols = cols;

    this.cells = [];
    for(var i = 0; i < rows; i++)
        for(var j = 0; j < cols; j++)
            this.cells.push(new CellMemory(i, j));

    this.lastTouchedCell = null;
};

FieldMemory.prototype = {

    toString: function(){
        var str = '';
        for(var r = 0; r < this.rows; r ++){
            for(var c = 0; c < this.cols; c ++){
                var cell = this.getCellByRowCol(r, c);
                str += CellToCharWrapped_debug(cell.status);
            }
            str += '\n';
        }
        return str;
    },

    incorporateFireResult: function(firerow, firecol, resultMsg){
        var firedCell = this.getCellByRowCol(firerow, firecol);
        this.lastTouchedCell = firedCell;

        switch(resultMsg.status) {
            case CellStatus.UNTOUCHED:
                firedCell.status = CellStatus.FIRED;
                break;
            case CellStatus.DESTROYED:
                this.setCellStatusesAroundShipToWave_andShipCellsToDestroyed(resultMsg.destroyedShipCode);
                break;
            case CellStatus.MINE:
                this.setCellStatusesAroundMineToRadiation_andMineCellToMine(firedCell);
                break;
            default:
                firedCell.status = resultMsg.status
                break;
        }
    },

    setCellStatusesAroundMineToRadiation_andMineCellToMine: function(cell){
        cell.status = CellStatus.MINE;
        var frame = this.getCellsAroundCellcluster([cell]);
        for(var i in frame){
            var framecell = frame[i];
            if(framecell)
                if(framecell.status != CellStatus.WAVE_RADIATION)
                    if(framecell.status == CellStatus.WAVE)
                        framecell.status = CellStatus.WAVE_RADIATION;
                    else
                        framecell.status = CellStatus.RADIATION;
        }
    },

    setCellStatusesAroundShipToWave_andShipCellsToDestroyed: function(shipCode){
        var size = parseInt(shipCode.split('_')[0]);
        var orientation = shipCode.split('_')[1] == 'h';
        var headRow = parseInt(shipCode.split('_')[2].split('-')[0]);
        var headCol = parseInt(shipCode.split('_')[2].split('-')[1]);
        var deltaRow = orientation ? 0 : 1;
        var deltaCol = orientation ? 1 : 0;

        var cellcluster = [];
        for(var i = 0; i < size; i ++){
            var shipcell = this.getCellByRowCol(headRow + deltaRow * i, headCol + deltaCol * i);
            shipcell.status = CellStatus.DESTROYED;
            cellcluster.push(shipcell);
        }
        var neighbours = this.getCellsAroundCellcluster(cellcluster);

        for(var i = 0; i < neighbours.length; i ++){
            var cell = neighbours[i];
            if(cell)
                if(cell.status != CellStatus.WAVE_RADIATION)
                    if(cell.status == CellStatus.RADIATION)
                        cell.status = CellStatus.WAVE_RADIATION;
                    else
                        cell.status = CellStatus.WAVE;
        }
    },

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

    getUntouchedCells: function(){
        var cells = [];
        for(var i = 0; i < this.cells.length; i ++)
            if(this.cells[i].status == CellStatus.UNTOUCHED)
                cells.push(this.cells[i]);
        return cells;
    },

    countUntouchedCells: function(){
        var count = 0;
        for(var i = 0; i < this.cells.length; i ++)
            if(this.cells[i].status == CellStatus.UNTOUCHED)
                count ++;
        return count;
    },

    getCellsAroundCellcluster: function(cellcluster){
        var head = cellcluster[0];
        var size = cellcluster.length;

        var orientation = true;
        if(size > 1)
            orientation = head.row == cellcluster[1].row; //ehm, is that cool? why not... NOT!
        var neighbourCells = [];
        if(orientation){
            //west
            neighbourCells.push(this.getCellByRowCol(head.row, head.col - 1));
            //east
            neighbourCells.push(this.getCellByRowCol(head.row, head.col + size));
            //north and south
            for(var i = 0; i < size + 2; i ++){
                neighbourCells.push(this.getCellByRowCol(head.row - 1, head.col - 1 + i));
                neighbourCells.push(this.getCellByRowCol(head.row + 1, head.col - 1 + i));
            }
        } else {
            //north
            neighbourCells.push(this.getCellByRowCol(head.row - 1, head.col));
            //south
            neighbourCells.push(this.getCellByRowCol(head.row + size, head.col));
            //east and west
            for(var i = 0; i < size + 2; i ++){
                neighbourCells.push(this.getCellByRowCol(head.row - 1 + i, head.col - 1));
                neighbourCells.push(this.getCellByRowCol(head.row - 1 + i, head.col + 1));
            }
        }
        return neighbourCells;
    },

    computeAttributes: function(elements){
        for(var i in this.cells){
            var cell = this.cells[i];
            if(cell.status == CellStatus.UNTOUCHED){
                var frame = this.getCellsAroundCellcluster([cell]);
                cell.status = this.computeAttr(frame);
            }
        }

        for(var i in elements){
            var element = elements[i];
            if(element.isMine)
                element.occupyingCells[0].status = CellStatus.MINE;
            else
                for(var j in element.occupyingCells){
                    var shipcell = element.occupyingCells[j];
                    shipcell.status = CellStatus.SHIP;
                }
        }
    },

    computeAttr: function(frame){
        var containsShip = false;
        var containsMine = false;
        for(var i in frame){
            var framecell = frame[i];
            if(framecell)
                if(framecell.occupiedBy){
                    if(framecell.occupiedBy.isMine)
                        containsMine = true;
                    else
                        containsShip = true;
                }
        }

        if(containsShip && containsMine)
            return CellStatus.WAVE_RADIATION;
        if(containsShip)
            return CellStatus.WAVE;
        if(containsMine)
            return CellStatus.RADIATION;

        return CellStatus.UNTOUCHED;
    }

};
