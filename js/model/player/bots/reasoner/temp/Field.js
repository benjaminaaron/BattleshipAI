
var Field = function(rows, cols){
    this.rows = rows;
    this.cols = cols;

    this.cells = [];
    for(var r = 0; r < rows; r ++){
        var row = [];
        for(var c = 0; c < cols; c ++)
            row.push(CellType.UNTOUCHED);
        this.cells.push(row);
    }
};

Field.prototype = {
    toString: function(){
        var str = '';
        for(var r = 0; r < this.rows; r ++){
            for(var c = 0; c < this.cols; c ++)
                str += '[' + cellTypeToChar(this.cells[r][c]) + ']';
            str += '\n';
        }
        return str;
    },
    copy: function(){
        var copy = new Field(this.rows, this.cols);
        for(var r = 0; r < this.rows; r ++)
            for(var c = 0; c < this.cols; c ++)
                copy.cells[r][c] = this.cells[r][c];
        return copy;
    },
    place: function(size, pos){
        var isHoriz = pos.orientation ? 1 : 0;
        var isVert = pos.orientation ? 0 : 1;
        for(var i = 0; i < size; i ++)
            this.cells[pos.row + isVert * i][pos.col + isHoriz * i] = CellType.SHIP;
    },
    getValidPositions: function(size){
        var validPositions = [];

        // horizontal
        for(var r = 0; r < this.rows; r ++)
            for(var c = 0; c <= this.cols - size; c ++)
                if(this.isValidHorizPosition(r, c, size))
                    validPositions.push(new pos(true, r, c));

        // vertical
        for(var r = 0; r <= this.rows - size; r ++)
            for(var c = 0; c < this.cols; c ++)
                if(this.isValidVertPosition(r, c, size))
                    validPositions.push(new pos(false, r, c));

        return validPositions;
    },
    isValidHorizPosition: function(row, col, size){
        for(var c = col - 1; c < col + size + 1; c ++)
            for(var r = row - 1; r < row + 2; r ++)
                if(this.validCoords(r, c))
                    if(r == row && c >= col && c < col + size){
                        if(this.cells[r][c] != CellType.UNTOUCHED)
                            return false; 
                    }
                    else
                        if(this.cells[r][c] == CellType.SHIP)
                            return false; 
        return true;
    },
    isValidVertPosition: function(row, col, size){
        for(var c = col - 1; c < col + 2; c ++)
            for(var r = row - 1; r < row + size + 1; r ++)
                if(this.validCoords(r, c))
                    if(c == col && r >= row && r < row + size){
                        if(this.cells[r][c] != CellType.UNTOUCHED)
                            return false; 
                    }
                    else
                        if(this.cells[r][c] == CellType.SHIP)
                            return false; 
        return true;
    },
    validCoords: function(row, col){
        if(row >= 0 && row < this.rows && col >= 0 && col < this.cols)
            return true;
        return false;
    }
};







