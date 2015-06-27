


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
    DESTROYED: 4,
    RADIATION: 5,
    MINE: 6,
    WAVE_RADIATION: 7,
    //for internal use, won't come as inputfield with those on
    POSSIBLEMINE: 8,
    POSSIBLESHIP: 9
}

function CellToChar(cell){
    switch(cell){
        case Cell.UNTOUCHED:
            return ' ';
        case Cell.FIRED:
            return '.';
        case Cell.WAVE:
            return '~';
        case Cell.HIT:
            return 'x';
        case Cell.DESTROYED:
            return '=';  
        case Cell.RADIATION:
            return '*';
        case Cell.MINE:
            return 'M';
        case Cell.WAVE_RADIATION:
            return '#';
        case Cell.POSSIBLEMINE:
            return 'm';
        case Cell.POSSIBLESHIP:
            return '-';
        default: 
            return 'err';
    }
};

var ShipType = function(size, color, quantity){
    this.size = size;
    this.color = color;
    this.quantity = quantity;
    this.isMine = false;
    if(size == 1)
        this.isMine = true;
};
