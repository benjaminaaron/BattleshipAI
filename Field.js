var CellType = require('./util.js').CellType;

var Field = function(){
	this.cells = [];

	for(var r = 0; r < 10; r++){
		var row = [];
		for(var c = 0; c < 10; c++)
			row.push(CellType.EMPTY);
		this.cells.push(row);
	}
}

Field.prototype = {
	show: function(){
		var str = '\n   0  1  2  3  4  5  6  7  8  9\n';
		for(var r = 0; r < 10; r++){
			str = str + r + ' ';
			for(var c = 0; c < 10; c++)
				str = str + '[' + this.getCellChar(this.cells[r][c]) + ']';
			str = str + '\n';
		}
		return str;
	},
	getCellChar: function(cellType){
		switch(cellType){
			case CellType.EMPTY:
				return ' ';
			case CellType.SHIP:
				return 'x';
		}
	},
	placeShip: function(ship, orientation, row, col){
		// TODO check if placement is valid

		ship.headRow = row;
		ship.headCol = col;

		var r = row;
		var c = col;
		for(var i=0; i < ship.size; i++){		
			this.cells[r][c] = CellType.SHIP;
			if(orientation)
				c = c + 1;
			else 
				r = r + 1;
		}

		return true;
	}
}

module.exports = Field;