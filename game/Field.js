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
	show: function(newline, space){
		var ts = space + space; //two spaces
		var str = newline + space + ts + '0' + ts + '1' + ts + '2' + ts + '3' + ts + '4' + ts + '5' + ts + '6' + ts + '7' + ts + '8' + ts + '9' + newline; 
		for(var r = 0; r < 10; r++){
			str = str + r + space;
			for(var c = 0; c < 10; c++)
				str = str + '[' + this.getCellChar(this.cells[r][c]) + ']';
			str = str + newline;
		}
		return str;
	},
	getCellChar: function(cellType){ // TODO getter in enum (stephs idea)
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