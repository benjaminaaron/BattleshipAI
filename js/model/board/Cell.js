
var Cell = function(row, col){
    AbstractCell.call(this, row, col);
    //this.id = row + '_' + col;
    this.occupiedBy = null; 
    this.fired = false;
}

Cell.prototype = {
    fire: function(){
        if(this.fired){
            return null; //shouldn't be happening because AbstractPlayer doesn't allow those shots to go out
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
