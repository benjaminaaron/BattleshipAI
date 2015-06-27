
var Cell = function(row, col){
    CellMemory.call(this, row, col);
    this.occupiedBy = null;
    this.fired = false;
}

/**
 * Fires a shot to a cell. Cell forwards the shot to the occupying element (ship or mine), it it exists.
 * Gets called by board object.
 * @type {{fire: Function, toString: Function}}
 */
Cell.prototype = {

    fire: function(){
        if(this.fired){
            //shouldn't be happening because AbstractPlayer doesn't allow those shots to go out
            throw("fire() of Cell cannot be called twice!");
        }
        else {
            this.fired = true;
            var ship = this.occupiedBy;
            if(ship)
                return ship.fire();
            else
                return new CellStatusMsg(CellStatus.FIRED);
        }
    },

    toString: function(){
        return '(' + this.row + '/' + this.col + ') occupiedBy: [' + this.occupiedBy;
    }
}
