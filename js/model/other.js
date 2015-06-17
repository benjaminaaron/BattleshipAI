
var CellStatus = {
    UNTOUCHED: 0,
    FIRED : 1,
    HIT : 2,
    DESTROYED : 3,
    SPARE: 4,   // for neighbour cells of ships
                // TODO: change to WAVE
    MINE: 5,
    RADIATION: 6,    // indicates mine on adjacent cell
    WAVE: 7
}

/** 
* Important for GUI to decide whether the canvas needs to be redrawn. 
*/
var UpdateReport = {
    INIT: 0,
    SHIPMOVED: 1,
    SHIPWASMANUALLYPLACED: 2,
    SHIPFLIPPEDORIENTATION: 3,
    SHIPSWERERANDOMLYPLACED: 4,
    ONESETUPCOMPLETED: 5,
    ONETURNCOMPLETED: 6,
    GAMECOMPLETED: 7
}

var MouseEvent = {
    MOUSEDOWN: 0,
    MOUSEMOVE: 1,
    MOUSEUP: 2
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
