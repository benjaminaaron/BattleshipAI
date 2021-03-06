
var Cell = function(row, col){
    CellMemory.call(this, row, col);
    this.occupiedBy = null;
    this.drawMe = false;
}

Cell.prototype = {

    /**
     * Fires a shot to a cell. Cell forwards the shot to the occupying element (ship or mine), it it exists.
     * Gets called by board object.
     * @type {{fire: Function, toString: Function}}
     */
    fire: function(){

        if(this.drawMe){
            return new CellStatusMsg(CellStatus.UNDEFINED); //shouldnt happen but it does for some reason
        }
        else {
            this.drawMe = true;
            var element = this.occupiedBy; // ship or mine
            if(element)
                return element.fire();

            return new CellStatusMsg(this.status);
        }
    },

    toString: function(){
        return '(' + this.row + '/' + this.col + ') occupiedBy: [' + this.occupiedBy;
    }
}
