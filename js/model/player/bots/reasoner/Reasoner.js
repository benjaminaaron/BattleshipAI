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

		//this.undestroyedShips = this.ships.slice(); // makes a copy

		this.graph = new Graph(inputfield, this.ships);
		this.graph.generate();
	},

	generateScenarios: function(){
		var shootableCells = this.inputfield.getShootablePositions();

		var firePos = new Pos(2, 0);
		console.log('\n\nfirePos: ' + firePos);

		var pruningAverage = this.getPruningAverage(firePos);

		console.log('\n\pruningAverage:');
		console.log(pruningAverage);
	},

	getPruningAverage: function(pos){
		//var allPossibleFireResults = [Cell.FIRED, Cell.WAVE, Cell.HIT, Cell.DESTROYED, Cell.RADIATION, Cell.MINE, Cell.WAVE_RADIATION];

		var leaves = this.graph.getLeaves();

		var possibleFireResults = [];
		for(var i in leaves){
			var leaf = leaves[i];
			console.log('' + leaf);
			var newPossibleFireResults = leaf.field.whatCouldBeHere(pos, this.inputfield);
			console.log(CellArrToStr(newPossibleFireResults));
			possibleFireResults = possibleFireResults.concat(newPossibleFireResults);
		}

		var counters = [0, 0, 0, 0, 0, 0, 0];

		for(var i in possibleFireResults){
			switch(possibleFireResults[i]){
				case Cell.FIRED:
					counters[0] ++;
					break;
				case Cell.WAVE:
					counters[1] ++;
					break;
				case Cell.HIT:
					counters[2] ++;
					break;
				case Cell.DESTROYED:
					counters[3] ++;
					break;
				case Cell.RADIATION:
					counters[4] ++;
					break;
				case Cell.MINE:
					counters[5] ++;
					break;
				case Cell.WAVE_RADIATION:
					counters[6] ++;
					break;
			}
		}



		var sum = 0;
		var nonZeros = 0;

		for(var i in counters)
			if(counters[i] != 0){
				sum += leaves.length - counters[i];
				nonZeros ++;
			}

		var pruningAverage = sum / nonZeros;

		var str = leaves.length + ' leaves, possibleFireResults: ' + CellArrToStr(possibleFireResults) + '\n';
		str += 'FIRED: ' + counters[0] + (counters[0] == 0 ? '' : ' -> ' + (leaves.length - counters[0])) + '\n';
		str += 'WAVE: ' + counters[1] + (counters[1] == 0 ? '' : ' -> ' + (leaves.length - counters[1])) + '\n';
		str += 'HIT: ' + counters[2] + (counters[2] == 0 ? '' : ' -> ' + (leaves.length - counters[2])) + '\n';
		str += 'DESTROYED: ' + counters[3] + (counters[3] == 0 ? '' : ' -> ' + (leaves.length - counters[3])) + '\n';
		str += 'RADIATION: ' + counters[4] + (counters[4] == 0 ? '' : ' -> ' + (leaves.length - counters[4])) + '\n';
		str += 'MINE: ' + counters[5] + (counters[5] == 0 ? '' : ' -> ' + (leaves.length - counters[5])) + '\n';
		str += 'WAVE_RADIATION: ' + counters[6] + (counters[6] == 0 ? '' : ' -> ' + (leaves.length - counters[6])) + '\n';
		str += 'sum: ' + sum + ' nonZeros: ' + nonZeros + ' -> pruningAverage: ' + pruningAverage;
		console.log(str);

		return pruningAverage;
	},

};
