
var CellMemory = function(row, col){
    this.row = row;
    this.col = col;
    this.status = CellStatus.UNTOUCHED;
}

CellMemory.prototype = {
    getStatus: function() {
        return this.status;
    }
}