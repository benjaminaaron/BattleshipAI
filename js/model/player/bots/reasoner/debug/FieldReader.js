var FieldReader = function(){

    // 0leavesField.txt input START - - - - - -

    var rows = 10;
    var cols = 10;

    this.debugfield = new RField(rows, cols);

    this.shipTypes = [
        new ShipType(1, 'gray', 1),
        new ShipType(5, 'aqua', 1),
        new ShipType(4, 'red', 1),
        new ShipType(3, 'lime', 1),
        new ShipType(2, 'orange', 1)
    ];

    var fieldStr =
     '[ ][ ][ ][ ][ ][~][ ][ ][ ][ ]\n'+
     '[.][ ][.][ ][ ][~][.][ ][.][ ]\n'+
     '[ ][ ][.][~][x][~][~][~][~][.]\n'+
     '[ ][ ][.][ ][ ][~][=][=][~][ ]\n'+
     '[.][ ][ ][ ][x][~][~][~][~][~]\n'+
     '[ ][.][.][~][x][ ][ ][~][=][~]\n'+
     '[ ][ ][.][ ][ ][#][.][~][=][~]\n'+
     '[~][~][~][#][ ][*][ ][~][=][~]\n'+
     '[=][=][=][~][ ][ ][ ][~][=][~]\n'+
     '[~][~][~][~][.][ ][ ][~][~][~]';

     // 0leavesField.txt input END - - - - - -

     var fieldStrRows = fieldStr.split('\n');

     for(var r = 0; r < rows; r ++){
        var rowStr = fieldStrRows[r];
        var pos;
        for(var c = 0; c < cols; c ++){
            pos = 1 + c * 3;
            this.debugfield.cells[r][c] = RCharToCell(rowStr[pos]);
        }
     }
     
};
