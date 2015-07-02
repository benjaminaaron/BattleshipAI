
var Cell = function(row, col){
    CellMemory.call(this, row, col);
    this.occupiedBy = null;
    this.fired = false;
}

Cell.prototype = {

    /**
     * Fires a shot to a cell. Cell forwards the shot to the occupying element (ship or mine), it it exists.
     * Gets called by board object.
     * @type {{fire: Function, toString: Function}}
     */
    fire: function(){

        if(this.fired){
            //shouldn't be happening because AbstractPlayer doesn't allow those shots to go out
            // TODO gets thrown, probably when backshot of mine hits a field that was already shot.
            // Occurred during turn of bot when a mine was hit and a cell was targeted by the backshot
            // that was occupied by a ship. Fix it fix it fix it! ^^
            throw("fire() of Cell cannot be called twice! " + this);
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
