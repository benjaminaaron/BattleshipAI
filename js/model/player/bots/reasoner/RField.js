
var RField = function(rows, cols){
    this.rows = rows;
    this.cols = cols;

    this.cells = [];
    for(var r = 0; r < rows; r ++){
        var row = [];
        for(var c = 0; c < cols; c ++)
            row.push(RCell.UNTOUCHED);
        this.cells.push(row);
    }
    this.myShipPositions = [];
};

RField.prototype = {

    toString: function(){
        var str = '';
        for(var r = 0; r < this.rows; r ++){
            for(var c = 0; c < this.cols; c ++)
                str += '[' + RCellToChar(this.cells[r][c]) + ']';
            str += '\n';
        }
        return str;
    },

// - - - - - - - - - - - - - - - - - - - - - - - - - -

    copy: function(){
        var copy = new RField(this.rows, this.cols);
        for(var r = 0; r < this.rows; r ++)
            for(var c = 0; c < this.cols; c ++)
                copy.cells[r][c] = this.cells[r][c];
        copy.myShipPositions = this.myShipPositions.slice();
        return copy;
    },

    isIdenticalTo: function(otherfield){ // for twin-sibling identification
        for(var r = 0; r < this.rows; r ++)
            for(var c = 0; c < this.cols; c ++)
                if(this.cells[r][c] != otherfield.cells[r][c])
                    return false;
        return true;
    },

// - - - - - - - - - - - - - - - - - - - - - - - - - -

    place: function(shipPos){
        if(shipPos.size == 1) // mine
            this.cells[shipPos.headrow][shipPos.headcol] = RCell.POSSIBLEMINE;
        else{
            var isHoriz = shipPos.orientation ? 1 : 0;
            var isVert = shipPos.orientation ? 0 : 1;
            for(var i = 0; i < shipPos.size; i ++)
                this.cells[shipPos.headrow + isVert * i][shipPos.headcol + isHoriz * i] = RCell.POSSIBLESHIP;
        }
        this.myShipPositions.push(shipPos);
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
                    validPositions.push(new RShipPos(true, size, r, c));

        if(size != 1){ // size 1 is a mine, enough to collect valid positions once
            // vertical
            for(var r = 0; r <= this.rows - size; r ++)
                for(var c = 0; c < this.cols; c ++)
                    if(this.isValidVertPosition(r, c, size))
                        validPositions.push(new RShipPos(false, size, r, c));
        }

        return validPositions;
    },

    isValidHorizPosition: function(row, col, size){
        // core
        var hitcounter = 0;
        for(var c = col; c < col + size; c ++){
            if(!this.validForCore(this.cells[row][c], size == 1))
                return false;
            if(this.cells[row][c] == RCell.HIT)
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
            if(this.cells[r][col] == RCell.HIT)
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
        if(cell == RCell.UNTOUCHED || (!isMine && cell == RCell.HIT))
            return true;
        return false;
    },

    validForFrame: function(cell){
        if(cell == RCell.UNTOUCHED || cell == RCell.WAVE || cell == RCell.RADIATION || cell == RCell.WAVE_RADIATION)
            return true;
        return false;
    },

// - - - - - - - - - - - - - - - - - - - - - - - - - -

    allSatisfied: function(wavesPos, hitsPos, radiationsPos){
        return this.allWavesSatisfied(wavesPos) && this.allHitsSatisfied(hitsPos) && this.allRadiationsSatisfied(radiationsPos);
    },

    allHitsSatisfied: function(hitsPos){
        for(var i in hitsPos)
            if(this.cells[hitsPos[i].row][hitsPos[i].col] != RCell.POSSIBLESHIP)
                return false;
        return true;
    },

    allWavesSatisfied: function(wavesPos){
        for(var i in wavesPos){
            var wavePos = wavesPos[i];
            if(!this.hasOneOfTheseCellsAroundIt(wavePos, [RCell.POSSIBLESHIP, RCell.HIT, RCell.DESTROYED])) //POSSIBLEDEBUG added HIT later, should be there right??
                return false;
            if(this.cells[wavePos.row][wavePos.col] != RCell.WAVE_RADIATION)
                if(this.hasOneOfTheseCellsAroundIt(wavePos, [RCell.POSSIBLEMINE, RCell.MINE]))
                    return false;
        }
        return true;
    },

    allRadiationsSatisfied: function(radiationsPos){
        for(var i in radiationsPos){
            var radiationPos = radiationsPos[i];
            if(!this.hasOneOfTheseCellsAroundIt(radiationPos, [RCell.POSSIBLEMINE, RCell.MINE]))
                return false;
            if(this.cells[radiationPos.row][radiationPos.col] != RCell.WAVE_RADIATION)
                if(this.hasOneOfTheseCellsAroundIt(radiationPos, [RCell.POSSIBLESHIP, RCell.HIT, RCell.DESTROYED]))
                    return false;
        }
        return true;
    },

    hasOneOfTheseCellsAroundIt: function(pos, cells){ // use getNeighbourhood to reduce code? or is that a waste of Pos-Objects
        for(var c = pos.col - 1; c < pos.col + 2; c ++)
            for(var r = pos.row - 1; r < pos.row + 2; r ++)
                if(this.validCoords(r, c) && !(r == pos.row && c == pos.col))
                    if(cells.indexOf(this.cells[r][c]) != -1)
                        return true; //POSSIBLEDEBUG changed here from interim boolean, that shouldn't affect anything?
        return false;
    },

// - - - - - - - - - - - - - - - - - - - - - - - - - - for generating scenarios

    wouldBeDestroyingShot: function(pos, inputfield){ // TODO solve this mathematically instead of loop-empirically?? :)
        for(var i in this.myShipPositions){
            var returnShipPos = null;

            var shipPos = this.myShipPositions[i];
            //console.log(shipPos.orientation, shipPos.size, shipPos.headrow, shipPos.headcol);
            if(shipPos.orientation){
                if(shipPos.headrow == pos.row){
                    var hitcounter = 0;
                    for(var c = shipPos.headcol; c < shipPos.headcol + shipPos.size; c ++){
                        if(inputfield.cells[pos.row][c] == RCell.HIT)
                            hitcounter ++;
                        if(c == pos.col)
                            returnShipPos = shipPos;
                    }
                }
            } else {
                if(shipPos.headcol == pos.col){
                    var hitcounter = 0;
                    for(var r = shipPos.headrow; r < shipPos.headrow + shipPos.size; r ++){
                        if(inputfield.cells[r][pos.col] == RCell.HIT)
                            hitcounter ++;
                        if(r == pos.row)
                            returnShipPos = shipPos;
                    }

                }
            }

            if(returnShipPos != null)
                return returnShipPos.size - hitcounter == 1; // then the next hit would destroy the ship
        }   // else case? should never happen
    },

    whatCouldBeHere: function(pos, inputfield){

        var mypos = this.cells[pos.row][pos.col];
        switch(mypos){
            case RCell.POSSIBLESHIP:
                if(this.wouldBeDestroyingShot(pos, inputfield))
                    return RCell.DESTROYED;
                else
                    return RCell.HIT;
            case RCell.POSSIBLEMINE:
                return RCell.MINE;
            default:
                var couldbe = null;
                var WAVE_RADIATION_casechecker = 0;

                if(this.hasOneOfTheseCellsAroundIt(pos, [RCell.HIT, RCell.DESTROYED, RCell.POSSIBLESHIP])){
                    couldbe = RCell.WAVE;
                    WAVE_RADIATION_casechecker ++;
                }

                if(this.hasOneOfTheseCellsAroundIt(pos, [RCell.MINE, RCell.POSSIBLEMINE])){
                    couldbe = RCell.RADIATION;
                    WAVE_RADIATION_casechecker ++;
                }

                if(WAVE_RADIATION_casechecker == 2){
                    couldbe = RCell.WAVE_RADIATION;
                }

                if(couldbe == null)
                    couldbe = RCell.FIRED;

                return couldbe;
        }
    },

// - - - - - - - - - - - - - - - - - - - - - - - - - -

    /**
    * When only 1 leaf was generated things are clear, just hand over a list of shooting targets then
    */
    getRemainingTargetsPos: function(inputfield){
        var targets = [];
        for(var r = 0; r < this.rows; r ++)
            for(var c = 0; c < this.cols; c ++)
                if(this.cells[r][c] == RCell.POSSIBLESHIP && inputfield.cells[r][c] == RCell.UNTOUCHED)
                    targets.push(new Pos(r, c));
        return targets;
    },

// - - - - - - - - - - - - - - - - - - - - - - - - - -

    getWavesPos: function(){
        return this.getObjPositions(RCell.WAVE).concat(this.getObjPositions(RCell.WAVE_RADIATION));
    },

    getHitsPos: function(){
        return this.getObjPositions(RCell.HIT);
    },

    getRadiationsPos: function(){
        return this.getObjPositions(RCell.RADIATION).concat(this.getObjPositions(RCell.WAVE_RADIATION));
    },

    getShootablePositions: function(){
        return this.getObjPositions(RCell.UNTOUCHED);
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
        var destroyedCellsPos = this.getObjPositions(RCell.DESTROYED);

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
            destroyedShips.push(new RShipPos(orientation, size, headrow, headcol));
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
        return this.getObjPositions(RCell.MINE).length;
    }

};
