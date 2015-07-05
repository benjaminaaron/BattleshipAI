
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
};

function removeDuplicates(arr){
    var uniqueArr = [];
    $.each(arr, function(i, el){
        if($.inArray(el, uniqueArr) === -1) uniqueArr.push(el);
    });
    return uniqueArr;
};


// - - - - - - - - TEMP: integrates later with existing code - - - - - - - -


function Pos(row, col){
    this.row = row;
    this.col = col;
    this.toString = function(){
        return row  + '/' + col;
    }
};

function RShipPos(orientation, size, headrow, headcol){
    this.orientation = orientation;
    this.size = size;
    this.headrow = headrow;
    this.headcol = headcol;
};

var RCell = {
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
    POSSIBLESHIP: 9,
    UNDEFINED: 10
};

function RCellToCharWrapped(cell){
    return '[' + RCellToChar(cell) + ']';
};

function RCellToChar(cell){
    switch(cell){
        case RCell.UNTOUCHED:
            return ' ';
        case RCell.FIRED:
            return '.';
        case RCell.WAVE:
            return '~';
        case RCell.HIT:
            return 'x';
        case RCell.DESTROYED:
            return '=';
        case RCell.RADIATION:
            return '*';
        case RCell.MINE:
            return 'M';
        case RCell.WAVE_RADIATION:
            return '#';
        case RCell.POSSIBLEMINE:
            return 'm';
        case RCell.POSSIBLESHIP:
            return '-';
        default:
            return '0';
    }
};

function RCharToCell(char){
    switch(char){
        case ' ':
            return RCell.UNTOUCHED;
        case '.':
            return RCell.FIRED;
        case '~':
            return RCell.WAVE;
        case 'x':
            return RCell.HIT;
        case '=':
            return RCell.DESTROYED;
        case '*':
            return RCell.RADIATION;
        case 'M':
            return RCell.MINE ;
        case '#':
            return RCell.WAVE_RADIATION;
        case 'm':
            return RCell.POSSIBLEMINE;
        case '-':
            return RCell.POSSIBLESHIP;
        default:
            return RCell.UNDEFINED;
    }
};


function RCellArrToStr(cellArr){
    var str = '';
    for(var i in cellArr)
        str += RCellToString(cellArr[i]) + ', ';
    return str.substring(0, str.length - 2);
};

function RCellToString(cell){
    switch(cell){
        case RCell.UNTOUCHED:
            return 'UNTOUCHED';
        case RCell.FIRED:
            return 'FIRED';
        case RCell.WAVE:
            return 'WAVE';
        case RCell.HIT:
            return 'HIT';
        case RCell.DESTROYED:
            return 'DESTROYED';
        case RCell.RADIATION:
            return 'RADIATION';
        case RCell.MINE:
            return 'MINE';
        case RCell.WAVE_RADIATION:
            return 'WAVE_RADIATION';
        case RCell.POSSIBLEMINE:
            return 'POSSIBLEMINE';
        case RCell.POSSIBLESHIP:
            return 'POSSIBLESHIP';
        default:
            return 'ERROR';
    }
};


/*
var ShipType = function(size, color, quantity){
    this.size = size;
    this.color = color;
    this.quantity = quantity;
    this.isMine = false;
    if(size == 1)
        this.isMine = true;
};*/
