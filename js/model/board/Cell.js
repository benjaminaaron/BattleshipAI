
var Cell = function(row, col){
    AbstractCell.call(this, row, col);
    this.id = row + '_' + col;

    this.occupiedBy = null;
    this.hoveredBy = null;
    this.shipsInMyNeighbourhood = 0;
    
    this.fired = false;
    this.fire = function(){
        if(this.fired){
            //return CellStatus.ALREADYSHOT;
        }
        else {
            this.fired = true;
            var ship = this.occupiedBy;
            if(ship)
                return ship.fire();
            else
                return new CellStatusMsg(CellStatus.FIRED);
        }
    };
    this.toString = function(){
        return '(' + this.row + '/' + this.col + ') occupiedBy: [' + this.occupiedBy + '] all neighbour cells are free: ' + this.shipsInMyNeighbourhood;
    };
}
