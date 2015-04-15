
var CellStatus = {
    UNTOUCHED: 0,
    FIRED : 1,
    HIT : 2,
    DESTROYED : 3,
    SPARE: 4, // for neighbour cells of destroyed ships
    ALLSHIPSDESTROYED : 5
}

var CellStatusMsg = function(status) {
    this.status = status;
    this.destroyedShip; // if there is one
}

var ShipPos = function(orientation, row, col){
    this.orientation = orientation;
    this.row = row;
    this.col = col;
}
