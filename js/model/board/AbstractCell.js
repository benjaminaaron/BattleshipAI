
var AbstractCell = function(row, col){
    this.row = row;
    this.col = col;
    this.status = CellStatus.UNTOUCHED;
}