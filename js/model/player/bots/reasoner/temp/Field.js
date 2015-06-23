
var Field = function(rows, cols){
    this.rows = rows;
    this.cols = cols;

    this.cells = [];
    for(var r = 0; r < rows; r ++){
        var row = [];
        for(var c = 0; c < cols; c ++)
            row.push(Cell.UNTOUCHED);
        this.cells.push(row);
    }
};

Field.prototype = {

    toString: function(){
        var str = '';
        for(var r = 0; r < this.rows; r ++){
            for(var c = 0; c < this.cols; c ++)
                str += '[' + CellToChar(this.cells[r][c]) + ']';
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

    place: function(shipPos){
        var isHoriz = shipPos.orientation ? 1 : 0;
        var isVert = shipPos.orientation ? 0 : 1;
        for(var i = 0; i < shipPos.size; i ++)
            this.cells[shipPos.row + isVert * i][shipPos.col + isHoriz * i] = Cell.SHIP;
    },

    getValidPositions: function(size){
        var validPositions = [];
        // horizontal
        for(var r = 0; r < this.rows; r ++)
            for(var c = 0; c <= this.cols - size; c ++)
                if(this.isValidHorizPosition(r, c, size))
                    validPositions.push(new ShipPos(true, size, r, c));
        // vertical
        for(var r = 0; r <= this.rows - size; r ++)
            for(var c = 0; c < this.cols; c ++)
                if(this.isValidVertPosition(r, c, size))
                    validPositions.push(new ShipPos(false, size, r, c));
        return validPositions;
    },

    isValidHorizPosition: function(row, col, size){
        // core
        for(var c = col; c < col + size; c ++)
            if(!this.validForShipCore(this.cells[row][c]))
                return false;
        // frame
        for(var r = row - 1; r < row + 2; r ++)
            for(var c = col - 1; c < col + size + 1; c ++)
                if(r != row || c == col - 1 || c == col + size)
                    if(this.validCoords(r, c))
                        if(!this.validForShipFrame(this.cells[r][c]))
                            return false;
        return true;
    },

    isValidVertPosition: function(row, col, size){
        // core
        for(var r = row; r < row + size; r ++)
            if(!this.validForShipCore(this.cells[r][col]))
                return false;
        // frame
        for(var c = col - 1; c < col + 2; c ++)
            for(var r = row - 1; r < row + size + 1; r ++)
                if(c != col || r == row - 1 || r == row + size)
                    if(this.validCoords(r, c))
                        if(!this.validForShipFrame(this.cells[r][c]))
                            return false;
        return true;
    },

    validForShipCore: function(cell){
        if(cell == Cell.UNTOUCHED || cell == Cell.HIT)
            return true;
        return false;
    },

    validForShipFrame: function(cell){
        if(cell == Cell.UNTOUCHED || cell == Cell.WAVE)
            return true;
        return false;
    },

    validCoords: function(row, col){
        if(row >= 0 && row < this.rows && col >= 0 && col < this.cols)
            return true;
        return false;
    },

    allSatisfied: function(wavesPos, hitsPos){
        return this.allWavesSatisfied(wavesPos) && this.allHitsSatisfied(hitsPos);
    },

    allHitsSatisfied: function(hitsPos){
        for(i in hitsPos)
            if(this.cells[hitsPos[i].row][hitsPos[i].col] != Cell.SHIP)
                return false;
        return true;
    },

    /**
    * Gives true or false whether or not all waves have at least one ship next to them.
    */
    allWavesSatisfied: function(wavesPos){
        var allWavesSatisfied = true;
        for(i in wavesPos)
            if(!this.hasShipAroundIt(wavesPos[i]))
                allWavesSatisfied = false;
        return allWavesSatisfied;
    },

    getWavesPos: function(){ // only called on inputfield
        return this.getObjPositions(Cell.WAVE);
    },

    getHitsPos: function(){
        return this.getObjPositions(Cell.HIT);
    },

    getObjPositions: function(cell){
        var objPositions = [];
        for(var r = 0; r < this.rows; r ++)
            for(var c = 0; c < this.cols; c ++)
                if(this.cells[r][c] == cell)
                    objPositions.push(new Pos(r, c));
        return objPositions;
    },

    hasShipAroundIt: function(pos){
        var hasShipAroundIt = false;
        for(var c = pos.col - 1; c < pos.col + 2; c ++)
            for(var r = pos.row - 1; r < pos.row + 2; r ++)
                if(this.validCoords(r, c))
                    if(!(r == pos.row && c == pos.col))
                        if(this.cells[r][c] == Cell.SHIP)
                            hasShipAroundIt = true;
        return hasShipAroundIt;
    },

    getShootablePositions: function(){
        var shootablePositions = [];
         for(var r = 0; r < this.rows; r ++)
            for(var c = 0; c < this.cols; c ++)
                if(this.cells[r][c] == Cell.UNTOUCHED)
                    shootablePositions.push(new Pos(r, c));
        return shootablePositions;
    }

};







