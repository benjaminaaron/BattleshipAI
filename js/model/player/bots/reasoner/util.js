


/**
* for sorting the ships descending (biggest first)
*/
function sortDesc(a, b) {
    return b - a;
};

/**
* used in GraphmlExporter to initate a download of a file with the given filename and text-content
*/
function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}


// - - - - - - - - TEMP: integrates later with existing code - - - - - - - -

function Pos(row, col){
    this.row = row;
    this.col = col;
    this.toString = function(){
        return row  + '/' + col;
    }
};

function ShipPos(orientation, size, row, col){
    this.orientation = orientation;
    this.size = size;
    this.row = row;
    this.col = col;
};

var Cell = {
    UNTOUCHED: 0,
    FIRED: 1,
    WAVE: 2,
    HIT: 3,
    DESTROYED: 4, // how to implement that??
    SHIP: 5 // only for internal use, it won't come as inputfield with that
}

function CellToChar(cell){
    switch(cell){
        case Cell.UNTOUCHED:
            return ' ';
        case Cell.FIRED:
            return '.';
        case Cell.HIT:
            return 'x';
        case Cell.DESTROYED:
            return 'X';   
        case Cell.WAVE:
            return '~';
        case Cell.SHIP:
            return '-';
        default: 
            return 'err';
    }
};

var ShipType = function(size, color, quantity){
    this.size = size;
    this.color = color;
    this.quantity = quantity;
};
