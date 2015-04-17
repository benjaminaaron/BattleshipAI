
var CellStatus = {
    UNTOUCHED: 0,
    FIRED : 1,
    HIT : 2,
    DESTROYED : 3,
    SPARE: 4 // for neighbour cells of destroyed ships
}

var CellStatusMsg = function(status) {
    this.status = status;
    this.destroyedShipCode; // if there is one
    this.allShipsDestroyed = false;
}

var ShipPos = function(orientation, row, col){
    this.orientation = orientation;
    this.row = row;
    this.col = col;
}

var ShipType = function(size, color, quantity){
    this.size = size;
    this.color = color;
    this.quantity = quantity;
}
