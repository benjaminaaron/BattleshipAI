var Dir = function(name, deltaRow, deltaCol){
    this.name = name;
    this.deltaRow = deltaRow;
    this.deltaCol = deltaCol;
    this.mulDeltaRow = function(fact){
        return this.deltaRow * fact;
    }
    this.mulDeltaCol = function(fact){
        return this.deltaCol * fact;
    }
    this.flip = function(){
        this.deltaRow *= -1;
        this.deltaCol *= -1;
    }
};


var DestructionGoal = function(cell, caller){
    this.cell = cell;
    this.caller = caller;
    this.fieldMemory = caller.fieldMemory;
    var rows = caller.board.rows;
    var cols = caller.board.cols; // 10x10

    var northDone = cell.row == 0 || this.fieldMemory.getCellByRowCol(cell.row - 1, cell.col).status == CellStatus.FIRED;
    var eastDone = cell.col == cols - 1 || this.fieldMemory.getCellByRowCol(cell.row, cell.col + 1).status == CellStatus.FIRED;
    var southDone = cell.row == rows - 1 || this.fieldMemory.getCellByRowCol(cell.row + 1, cell.col).status == CellStatus.FIRED;
    var westDone = cell.col == 0 || this.fieldMemory.getCellByRowCol(cell.row, cell.col - 1).status == CellStatus.FIRED;

    this.directions = [];
    if(!northDone)
        this.directions.push(new Dir('north', -1, 0));
    if(!eastDone)
        this.directions.push(new Dir('east', 0, 1));
    if(!southDone)
        this.directions.push(new Dir('south', 1, 0));
    if(!westDone)
        this.directions.push(new Dir('west', 0, -1));

    this.secondHitFound = false;
    this.lastDir = null;
    this.mulFact = 1;
};

DestructionGoal.prototype = {
    think: function(){

        var lastTouchedCell = this.fieldMemory.lastTouchedCell;

        if(this.cell != lastTouchedCell && lastTouchedCell.status == CellStatus.HIT){
            this.secondHitFound = true;
            console.log('2nd hit was in dir ' + this.lastDir.name);
        }

        if(!this.secondHitFound){
            var randIndex = Math.round(Math.random() * (this.directions.length - 1));
            var dir = this.directions[randIndex];
            this.lastDir = dir;
            this.directions.splice(randIndex, 1);
            var targetRow = this.cell.row + dir.deltaRow;
            var targetCol = this.cell.col + dir.deltaCol;
            this.fire(targetRow, targetCol);
        } else {

            var testTargetRow = this.cell.row + this.lastDir.mulDeltaRow(this.mulFact + 1);
            var testTargetCol = this.cell.col + this.lastDir.mulDeltaCol(this.mulFact + 1);
            var testTargetCell = this.fieldMemory.getCellByRowCol(testTargetRow, testTargetCol);

            if(lastTouchedCell.status != CellStatus.HIT || !testTargetCell){
                this.lastDir.flip();
                this.mulFact = 0;
            } else {
                if(testTargetCell)
                    if(testTargetCell.status == CellStatus.FIRED){
                        this.lastDir.flip();
                        this.mulFact = 0;
                    }
            }

            this.mulFact ++;
            var targetRow = this.cell.row + this.lastDir.mulDeltaRow(this.mulFact);
            var targetCol = this.cell.col + this.lastDir.mulDeltaCol(this.mulFact);
            this.fire(targetRow, targetCol);
        }
    },

    fire: function(row, col){
        var self = this;
        setTimeout(function(){
            self.caller.fire(row, col);
        }, 10);
    }
};


function Zone() {};

Zone.getCentreOfBiggestSquare = function(fieldMemory) {
	var untouchedCells = fieldMemory.getUntouchedCells();

	var maxArea = 0;
	var indizesOfCellsWithMaxArea = [];

	for(var i=0; i < untouchedCells.length; i++){
		var cell = untouchedCells[i];
		var row = cell.row;
		var col = cell.col;
		var expand = true;
		var sideLength = 1;

/* idea: this is the checking pattern, here shown for sideLenght 5 in the 2nd expansion step:

	NNNNN
	W   E
	W x E
	w   E
	SSSSS
*/
		while(expand){
			sideLength += 2;
			//console.log('at start of while loop, sideLength is ' + sideLength);

			var d = Math.round(sideLength / 2) - 1;

			var N = true;
			for(var j=0; j < sideLength; j++)
				N = N && fieldMemory.cellIsExistingAndUntouched(row - d, col - d + j); // N
			//console.log("N: " + N);

			var S = true;
			for(var j=0; j < sideLength; j++)
				S = S && fieldMemory.cellIsExistingAndUntouched(row + d, col - d + j); // S
			//console.log("S: " + S);

			var E = true;
			for(var j=0; j < sideLength - 2; j++)
				E = E && fieldMemory.cellIsExistingAndUntouched(row - d + 1 + j, col + d); // E
			//console.log("E: " + E);

			var W = true;
			for(var j=0; j < sideLength - 2; j++)
				W = W && fieldMemory.cellIsExistingAndUntouched(row - d + 1 + j, col - d); // W
			//console.log("W: " + W);

			expand = N && E && S && W;
		}
		var area = Math.pow(sideLength - 2, 2);

		//console.log('index ' + i + '(' + row + '/' + col + ') has area ' + area);

		if(area > maxArea){
			maxArea = area;
			indizesOfCellsWithMaxArea = [];
			indizesOfCellsWithMaxArea.push(i);
		} else
			if(area == maxArea)
				indizesOfCellsWithMaxArea.push(i);
	}
/*	console.log('indize of cells with max area of ' + maxArea + ':');
	console.log(indizesOfCellsWithMaxArea);
	for(var i=0; i < indizesOfCellsWithMaxArea.length; i++)
		console.log(untouchedCells[indizesOfCellsWithMaxArea[i]]);   */

	var choiceIndex = indizesOfCellsWithMaxArea[Math.round(Math.random() * (indizesOfCellsWithMaxArea.length - 1))]; //TODO statistically solid? outsource in utility functions?
	return untouchedCells[choiceIndex];
};

/*
Zone.getBiggestArea = function(fieldMemory) { //method copied and adapted from getCentreOfBiggestSquare
	var untouchedCells = fieldMemory.getUntouchedCells();
	var maxArea = 0;

	for(var i = 0; i < untouchedCells.length; i ++){
		var cell = untouchedCells[i];
		var row = cell.row;
		var col = cell.col;
		var expand = true;
		var sideLength = 1;

		while(expand){
			sideLength += 2;
			var d = Math.round(sideLength / 2) - 1;
			var N = true;
			for(var j=0; j < sideLength; j++)
				N = N && fieldMemory.cellIsExistingAndUntouched(row - d, col - d + j);
			var S = true;
			for(var j=0; j < sideLength; j++)
				S = S && fieldMemory.cellIsExistingAndUntouched(row + d, col - d + j);
			var E = true;
			for(var j=0; j < sideLength - 2; j++)
				E = E && fieldMemory.cellIsExistingAndUntouched(row - d + 1 + j, col + d);
			var W = true;
			for(var j=0; j < sideLength - 2; j++)
				W = W && fieldMemory.cellIsExistingAndUntouched(row - d + 1 + j, col - d);
			expand = N && E && S && W;
		}
		var area = Math.pow(sideLength - 2, 2);
		if(area > maxArea)
			maxArea = area;
    }
    return maxArea;
};
*/

Zone.expandIntoDir = function(fieldMemory, startCell, rowDir, colDir){
	var nextCell = startCell;
	var expand = true;
	var freeFieldsAhead = -1;
	while(expand){
		freeFieldsAhead ++;
		nextCell = fieldMemory.cellIsExistingAndUntouched(nextCell.row + rowDir, nextCell.col + colDir);
		if(!nextCell)
			expand = false;
	}
	return freeFieldsAhead;
};


Zone.expandBarIntoDir = function(fieldMemory, barlength, startRow, startCol, rowDir, colDir){
	var expand = true;
	var bar = -1;
	while(expand){
		bar ++;
		for(var i=0; i < barlength; i++){
			var row = startRow + rowDir + i * Math.abs(colDir) + bar * rowDir;
			var col = startCol + colDir + i * Math.abs(rowDir) + bar * colDir;
			expand = expand && fieldMemory.cellIsExistingAndUntouched(row, col);
		}
	}
	return bar;
};


Zone.getCentreOfBiggestRect = function(fieldMemory){
/*	//debug
	fieldMemory.setCellStatus(2, 3, CellStatus.FIRED);
    fieldMemory.setCellStatus(1, 7, CellStatus.FIRED);
    fieldMemory.setCellStatus(5, 8, CellStatus.FIRED);
    fieldMemory.setCellStatus(7, 5, CellStatus.FIRED);
*/
	var untouchedCells = fieldMemory.getUntouchedCells();

	var maxArea = 0;
	var indizesOfCellsWithMaxArea = [];

	var patches = new Patches();

	for(var i=0; i < untouchedCells.length; i++){
		var cell = untouchedCells[i];
		var row = cell.row;
		var col = cell.col;
		//console.log('>>looking at untouched cell ' + i + ' (' + row + '/' + col + ') of ' + untouchedCells.length);

		// HORIZONTAL-FIRST expansion area

		// horizontal bar from east to west
		var east = this.expandIntoDir(fieldMemory, cell, 0, 1);
		//console.log('east: ' + east);

		var west = this.expandIntoDir(fieldMemory, cell, 0, -1);
		//console.log('west: ' + west);

		// expand horizontal bar vertically from south to north
		var horizSpanning = west + east + 1;

		var southbar = this.expandBarIntoDir(fieldMemory, horizSpanning, cell.row, cell.col - west, 1, 0);
		//console.log('southbar: ' + southbar);

		var northbar = this.expandBarIntoDir(fieldMemory, horizSpanning, cell.row, cell.col - west, -1, 0);
		//console.log('northbar: ' + northbar);

		var vertSpanning = southbar + northbar + 1;
		patches.push(new Patch(cell.row - northbar, cell.col - west, vertSpanning, horizSpanning));

		// VERTICAL-FIRST expansion area

		// vertical bar from south to north
		var south = this.expandIntoDir(fieldMemory, cell, 1, 0);
		//console.log('south: ' + south);

		var north = this.expandIntoDir(fieldMemory, cell, -1, 0);
		//console.log('north: ' + north);

		// expand vertical bar horizontally from east to west
		vertSpanning = south + north + 1;

		var eastbar = this.expandBarIntoDir(fieldMemory, vertSpanning, cell.row - north, cell.col, 0, 1);
		//console.log('eastbar: ' + eastbar);

		var westbar = this.expandBarIntoDir(fieldMemory, vertSpanning, cell.row - north, cell.col, 0, -1);
		//console.log('westbar: ' + westbar);

		horizSpanning = eastbar + westbar + 1;
		patches.push(new Patch(cell.row - north, cell.col - westbar, vertSpanning, horizSpanning));
	}
	//patches.show();
	return patches.getOneBiggestPatch().getOneMiddleCell();
};


var Patches = function(){
	this.patches = [];
	this.biggestPatches = [];
	this.biggestPatchArea = 0;
};

Patches.prototype = {
	push: function(patch){
		var existsAlready = false;
		for(var i=0; i < this.patches.length; i++)
			if(this.patches[i].id == patch.id)
				existsAlready = true;
		if(!existsAlready){
			this.patches.push(patch);
			if(patch.area > this.biggestPatchArea){
				this.biggestPatchArea = patch.area;
				this.biggestPatches = [];
				this.biggestPatches.push(patch);
			} else
				if(patch.area == this.biggestPatchArea)
					this.biggestPatches.push(patch);
		}
	},
	length: function(){
		return this.patches.length;
	},
	show: function(){
		for(var i=0; i < this.patches.length; i++)
			console.log('' + this.patches[i]);
	},
	getOneBiggestPatch: function(){
		var index = 0;
		if(this.biggestPatches.length > 1)
			index = Math.round(Math.random() * (this.biggestPatches.length - 1));
		return this.biggestPatches[index];
	}
}


var Patch = function(NWrow, NWcol, rowsHigh, colsWide){ //is one free rectangular spot
	this.NWcell = new Coord(NWrow, NWcol);
	this.rowsHigh = rowsHigh;
	this.colsWide = colsWide;
	this.SEcell = new Coord(NWrow + rowsHigh - 1, NWcol + colsWide - 1);
	this.area = rowsHigh * colsWide;

	this.id = this.NWcell.id + '_' + this.SEcell.id;

	this.toString = function(){
		return this.id + ': new patch with NWcell ' + NWrow + '/' + NWcol + ' and SEcell ' + this.SEcell.row + '/' + this.SEcell.col + ' >> rowsHigh: ' + rowsHigh + ' colsWide: ' + colsWide + ' > area: ' + this.area;
	}
	//console.log(this.getOneMiddleCell());
}

Patch.prototype = {

	getOneMiddleCell: function(){
		var NWrow = this.NWcell.row;
		var NWcol = this.NWcell.col;
		var rowsHigh = this.rowsHigh;
		var colsWide = this.colsWide;
		this.middleCells = [];

		var rowsEven = false;
		if(rowsHigh % 2 == 0)
			rowsEven = true;

		var colsEven = false;
		if(colsWide % 2 == 0)
			colsEven = true;

		if(rowsEven && colsEven){
			this.middleCells.push(new Coord(NWrow + Math.round(rowsHigh / 2) - 1, 	NWcol + Math.round(colsWide / 2) - 1)); // top left
			this.middleCells.push(new Coord(NWrow + Math.round(rowsHigh / 2) - 1, 	NWcol + Math.round(colsWide / 2)	)); // top right
			this.middleCells.push(new Coord(NWrow + Math.round(rowsHigh / 2), 		NWcol + Math.round(colsWide / 2) - 1)); // bottom left
			this.middleCells.push(new Coord(NWrow + Math.round(rowsHigh / 2), 		NWcol + Math.round(colsWide / 2)	));	// bottom right
		}

		if(rowsEven && !colsEven){
			this.middleCells.push(new Coord(NWrow + Math.round(rowsHigh / 2) - 1, 	NWcol + Math.round(colsWide / 2) - 1)); // top
			this.middleCells.push(new Coord(NWrow + Math.round(rowsHigh / 2), 		NWcol + Math.round(colsWide / 2) - 1)); // bottom
		}

		if(!rowsEven && colsEven){
			this.middleCells.push(new Coord(NWrow + Math.round(rowsHigh / 2) - 1, 	NWcol + Math.round(colsWide / 2) - 1)); // left
			this.middleCells.push(new Coord(NWrow + Math.round(rowsHigh / 2) - 1, 	NWcol + Math.round(colsWide / 2)	)); // right
		}

		if(!rowsEven && !colsEven)
			this.middleCells.push(new Coord(NWrow + Math.round(rowsHigh / 2) - 1, 	NWcol + Math.round(colsWide / 2) - 1)); // single center cell

		//console.log(this.middleCells);

		var randIndex = 0;
		if(this.middleCells.length > 1)
			randIndex = Math.round(Math.random() * (this.middleCells.length - 1));
		return this.middleCells[randIndex];
	}
};


var Coord = function(row, col){
	this.row = row;
	this.col = col;
	this.id = row + '-' + col;
};
