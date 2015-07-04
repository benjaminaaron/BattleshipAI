
var CellStatus = {
    UNTOUCHED: 0,
    FIRED : 1,  // been fired at, but is a miss
    HIT : 2,
    DESTROYED : 3,
    SHIP : 4,
    SPARE: 5,   // for neighbour cells of elements
                // TODO: change to WAVE
    MINE: 6,
    RADIATION: 7,    // indicates mine on adjacent cell
    WAVE: 8,         // for cells adjacent to elements
    WAVE_RADIATION: 9
};

function CellToCharWrapped_debug(cell){
    return '[' + CellToChar_debug(cell) + ']';
};

function CellToChar_debug(cell){
    switch(cell){
        case CellStatus.UNTOUCHED:
            return ' ';
        case CellStatus.FIRED:
            return '.';
        case CellStatus.WAVE:
            return '~';
        case CellStatus.HIT:
            return 'x';
        case CellStatus.DESTROYED:
            return '=';
        case CellStatus.RADIATION:
            return '*';
        case CellStatus.SHIP:
            return 'S';
        case CellStatus.MINE:
            return 'M';
        case CellStatus.WAVE_RADIATION:
            return '#';
        default:
            return '0';
    }
};

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
};

// TODO Umbenennen in CustomMouseEvent oder aehnliches!
var MouseEvent = {
    MOUSEDOWN: 0,
    MOUSEMOVE: 1,
    MOUSEUP: 2
};

var CellStatusMsg = function(status) {
    this.status = status;
    this.destroyedShipCode; // if there is one
    this.allShipsDestroyed = false;
};

var ShipPos = function(orientation, row, col){
    this.orientation = orientation;
    this.row = row;
    this.col = col;
};

var ShipType = function(size, color, quantity){
    this.size = size;
    this.color = color;
    this.quantity = quantity;
};
