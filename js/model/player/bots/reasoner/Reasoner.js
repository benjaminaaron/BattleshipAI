var Reasoner = function(shipTypes){ //extends AbstractStragety?
	this.graph;
    this.ships = [];
    for(var i = 0; i < shipTypes.length; i++)
        for(var j = 0; j < shipTypes[i].quantity; j++)
            this.ships.push(shipTypes[i].size);
    this.ships.sort(sortDesc);
	this.allShips = this.ships.slice();
};

Reasoner.prototype = {

	loadField: function(inputfield){
		this.inputfield = inputfield;

		var destroyedShips = inputfield.getDestroyedShips();

		for(var i in destroyedShips)
			this.ships.splice(this.ships.indexOf(destroyedShips[i].size), 1);

		for(var i = 0; i < inputfield.getMinesCount(); i ++)
			this.ships.splice(this.ships.indexOf(1), 1);

		this.undestroyedShips = this.ships.slice(); // makes a copy

		this.graph = new Graph(inputfield, this.ships);
		this.graph.generate();
	},

	generateScenarios: function(){
		var shootableCells = this.inputfield.getShootablePositions();

		//console.log(this.undestroyedShips);
		var firePos = shootableCells[0];
		console.log('firePos:');
		console.log(firePos);

// APPROACH 2
/*
		var possibleFireResults = [Cell.FIRED, Cell.WAVE, Cell.HIT, Cell.DESTROYED, Cell.RADIATION, Cell.MINE, Cell.WAVE_RADIATION];
		var testfield = this.inputfield.copy();
		testfield.cells[firePos.row][firePos.col] = Cell.HIT;
		console.log(testfield.isValid(this.allShips));
*/

// APPROACH 1
/*
		var possibleFireResults = this.inputfield.getPossibleFireResults(firePos, this.undestroyedShips);
		console.log('possibleFireResults:');
		console.log(CellArrToStr(possibleFireResults));
*/
	}

};
