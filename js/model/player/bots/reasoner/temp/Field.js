
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

// - - - - - - - - - - - - - - - - - - - - - - - - - -

    copy: function(){
        var copy = new Field(this.rows, this.cols);
        for(var r = 0; r < this.rows; r ++)
            for(var c = 0; c < this.cols; c ++)
                copy.cells[r][c] = this.cells[r][c];
        return copy;
    },

    isIdenticalTo: function(otherfield){
        for(var r = 0; r < this.rows; r ++)
            for(var c = 0; c < this.cols; c ++)
                if(this.cells[r][c] != otherfield.cells[r][c])
                    return false;
        return true;
    },

// - - - - - - - - - - - - - - - - - - - - - - - - - -

    place: function(shipPos){
        if(shipPos.size == 1) // mine
            this.cells[shipPos.row][shipPos.col] = Cell.POSSIBLEMINE;
        else{
            var isHoriz = shipPos.orientation ? 1 : 0;
            var isVert = shipPos.orientation ? 0 : 1;
            for(var i = 0; i < shipPos.size; i ++)
                this.cells[shipPos.row + isVert * i][shipPos.col + isHoriz * i] = Cell.POSSIBLESHIP;
        }
    },

// - - - - - - - - - - - - - - - - - - - - - - - - - -

    validCoords: function(row, col){
        if(row >= 0 && row < this.rows && col >= 0 && col < this.cols)
            return true;
        return false;
    },

// - - - - - - - - - - - - - - - - - - - - - - - - - -

    getValidPositions: function(size){
        var validPositions = [];
        // horizontal
        for(var r = 0; r < this.rows; r ++)
            for(var c = 0; c <= this.cols - size; c ++)
                if(this.isValidHorizPosition(r, c, size))
                    validPositions.push(new ShipPos(true, size, r, c));

        if(size != 1){ // size 1 is a mine, enough to collect valid positions once
            // vertical
            for(var r = 0; r <= this.rows - size; r ++)
                for(var c = 0; c < this.cols; c ++)
                    if(this.isValidVertPosition(r, c, size))
                        validPositions.push(new ShipPos(false, size, r, c));
        }

        return validPositions;
    },

    isValidHorizPosition: function(row, col, size){
        // core
        var hitcounter = 0;
        for(var c = col; c < col + size; c ++){
            if(!this.validForCore(this.cells[row][c], size == 1))
                return false;
            if(this.cells[row][c] == Cell.HIT)
                hitcounter ++;
        }
        if(hitcounter == size)
            return false;

        // frame
        for(var r = row - 1; r < row + 2; r ++)
            for(var c = col - 1; c < col + size + 1; c ++)
                if(r != row || c == col - 1 || c == col + size)
                    if(this.validCoords(r, c))
                        if(!this.validForFrame(this.cells[r][c]))
                            return false;
        return true;
    },

    isValidVertPosition: function(row, col, size){
        // core
        var hitcounter = 0;
        for(var r = row; r < row + size; r ++){
            if(!this.validForCore(this.cells[r][col], size == 1))
                return false;
            if(this.cells[r][col] == Cell.HIT)
                hitcounter ++;
        }
        if(hitcounter == size)
            return false;

        // frame
        for(var c = col - 1; c < col + 2; c ++)
            for(var r = row - 1; r < row + size + 1; r ++)
                if(c != col || r == row - 1 || r == row + size)
                    if(this.validCoords(r, c))
                        if(!this.validForFrame(this.cells[r][c]))
                            return false;
        return true;
    },

    validForCore: function(cell, isMine){
        if(cell == Cell.UNTOUCHED || (!isMine && cell == Cell.HIT))
            return true;
        return false;
    },

    validForFrame: function(cell){
        if(cell == Cell.UNTOUCHED || cell == Cell.WAVE || cell == Cell.RADIATION || cell == Cell.WAVE_RADIATION)
            return true;
        return false;
    },

// - - - - - - - - - - - - - - - - - - - - - - - - - -

    allSatisfied: function(wavesPos, hitsPos, radiationsPos){
        return this.allWavesSatisfied(wavesPos) && this.allHitsSatisfied(hitsPos) && this.allRadiationsSatisfied(radiationsPos);
    },

    allHitsSatisfied: function(hitsPos){
        for(var i in hitsPos)
            if(this.cells[hitsPos[i].row][hitsPos[i].col] != Cell.POSSIBLESHIP)
                return false;
        return true;
    },

    allWavesSatisfied: function(wavesPos){
        var allWavesSatisfied = true;
        for(var i in wavesPos)
            if(!this.hasRequiredCelltypeAroundIt(wavesPos[i], [Cell.POSSIBLESHIP, Cell.DESTROYED]))
                allWavesSatisfied = false;
        return allWavesSatisfied;
    },

    allRadiationsSatisfied: function(radiationsPos){
        var allRadiationsSatisfied = true;
        for(var i in radiationsPos)
            if(!this.hasRequiredCelltypeAroundIt(radiationsPos[i], [Cell.POSSIBLEMINE, Cell.MINE]))
                allRadiationsSatisfied = false;
        return allRadiationsSatisfied;
    },

    hasRequiredCelltypeAroundIt: function(pos, requiredCelltype){ // use getNeighbourhood to reduce code? or is that a waste of Pos-Objects
        var hasIt = false;
        for(var c = pos.col - 1; c < pos.col + 2; c ++)
            for(var r = pos.row - 1; r < pos.row + 2; r ++)
                if(this.validCoords(r, c) && !(r == pos.row && c == pos.col))
                    if(requiredCelltype.indexOf(this.cells[r][c]) != -1)
                        hasIt = true;
        return hasIt;
    },

// - - - - - - - - - - - - - - - - - - - - - - - - - -


// APPROACH 1

/*
    isValid: function(allShips){
        var dShips = this.getDestroyedShips();
        for(var i in dShips)
            if(dShips[i].size == 1)
                return false;
        // ... TODO
        return true;
    },
*/

// APPROACH 2

    getNeighbourhood: function(pos){
        var directions = [];
        for(var r = pos.row - 1; r < pos.row + 2; r ++)
            for(var c = pos.col - 1; c < pos.col + 2; c ++)
                if(this.validCoords(r, c) && !(c == pos.col && r == pos.row))
                    directions.push(this.cells[r][c]);
                else
                    directions.push(null);
        return new Neighbourhood(pos, directions);
    },

/*
    getNeighbourhood: function(pos){
        var directions = [];
        for(var r = pos.row - 1; r < pos.row + 2; r ++)
            for(var c = pos.col - 1; c < pos.col + 2; c ++)
                if(this.validCoords(r, c) && !(c == pos.col && r == pos.row))
                    directions.push(this.cells[r][c]);
        return directions;
    },*/

    getPossibleFireResults: function(pos, undestroyedShips){
        var possibleFireResults = [Cell.FIRED, Cell.WAVE, Cell.HIT, Cell.DESTROYED, Cell.RADIATION, Cell.MINE, Cell.WAVE_RADIATION];

        var neighbourhood = this.getNeighbourhood(pos);
        console.log(neighbourhood + '');

        console.log('can it be fired: ' + neighbourhood.canItBeFIRED());

        console.log('can it be hit: ' + neighbourhood.canItBeHIT());




        return possibleFireResults;
    },


    canItBeHIT: function(pos){


    },

/*
    hasNeighbourhoodTouchingHits: function(neighbourhood){ // investigate all different 1&1 pairs. TODO better way?
        for(var i = 0; i < neighbourhood.length - 1; i ++)
            for(var j = i + 1; j < neighbourhood.length; j ++){
                var pos1 = neighbourhood[i];
                var pos2 = neighbourhood[j];
                var cell1 = this.cells[pos1.row][pos1.col];
                var cell2 = this.cells[pos2.row][pos2.col];
                if(cell1 == Cell.HIT && cell2 == Cell.HIT)
                    if((pos1.col == pos2.col && Math.abs(pos1.row - pos2.row) == 1) || (pos1.row == pos2.row && Math.abs(pos1.col - pos2.col) == 1))
                        return true;
            }
        return false;
    },
*/
    removeFromPossibleFireResults: function(possibleFireResults, removeArr){
        for(var i in removeArr){
            var remove = removeArr[i];
            var index = possibleFireResults.indexOf(remove);
            if(index != -1)
                possibleFireResults.splice(index, 1);
        }
    },

/*
    couldThisHitDestroyAship: function(pos){ //TODO
        var hitstreaklength = 1;
        // north
        //while()
    },
*/

// - - - - - - - - - - - - - - - - - - - - - - - - - -

    getWavesPos: function(){
        return this.getObjPositions(Cell.WAVE).concat(this.getObjPositions(Cell.WAVE_RADIATION));
    },

    getHitsPos: function(){
        return this.getObjPositions(Cell.HIT);
    },

    getRadiationsPos: function(){
        return this.getObjPositions(Cell.RADIATION).concat(this.getObjPositions(Cell.WAVE_RADIATION));
    },

    getShootablePositions: function(){
        return this.getObjPositions(Cell.UNTOUCHED);
    },

    getObjPositions: function(cell){
        var objPositions = [];
        for(var r = 0; r < this.rows; r ++)
            for(var c = 0; c < this.cols; c ++)
                if(this.cells[r][c] == cell)
                    objPositions.push(new Pos(r, c));
        return objPositions;
    },

// - - - - - - - - - - - - - - - - - - - - - - - - - -

    getDestroyedShips: function(){
        var destroyedCellsPos = this.getObjPositions(Cell.DESTROYED);

        var ships = []; // will be arrays of cells finding each other, within an array

        while(destroyedCellsPos.length > 0){
            var dCellPos = destroyedCellsPos.splice(0, 1)[0];
            var fitsToExisting = false;
            for(var i in ships){
                var ship = ships[i];
                for(var j in ship)
                    if(this.positionsAreTouching(dCellPos, ship[j])){
                        ship.push(dCellPos);
                        fitsToExisting = true;
                    }
            }
            if(!fitsToExisting)
                ships.push([dCellPos]);
        }

        var destroyedShips = [];
        for(var i in ships){
            var ship = ships[i];
            var headrow = ship[0].row; // because of the way getObjPositions runs through the field, no sorting is required before using [0] as headrow/headcol
            var headcol = ship[0].col;
            var size = ship.length;
            var orientation = size == 1 ? null : ship[0].row == ship[1].row
            destroyedShips.push(new ShipPos(orientation, size, headrow, headcol));
        }

        return destroyedShips;
    },

    positionsAreTouching: function(pos1, pos2){
        var rowDiff = Math.abs(pos1.row - pos2.row);
        var colDiff = Math.abs(pos1.col - pos2.col);
        if(rowDiff + colDiff == 1 || (rowDiff == 1 && colDiff == 1))
            return true;
        return false;
    },

// - - - - - - - - - - - - - - - - - - - - - - - - - -

    getMinesCount: function(){
        return this.getObjPositions(Cell.MINE).length;
    }

};
