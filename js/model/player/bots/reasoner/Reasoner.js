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

		var possibleFireResults = this.getPossibleFireResults(firePos);

		console.log('\n\npossibleFireResults:');
		console.log(CellArrToStr(possibleFireResults));
	},

	getPossibleFireResults: function(pos){
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

		/*for(var i in allPossibleFireResults){
			var fireResult = allPossibleFireResults[i];
			if(this.worksWithAtLeastOneLeaf(leaves, pos, fireResult))
				possibleFireResults.push(fireResult);
		}*/

		return removeDuplicates(possibleFireResults);
	},

/*
	worksWithAtLeastOneLeaf: function(leaves, pos, hypoFireResult){
		for(var i in leaves){
			var leaf = leaves[i];
			if(leaf.field.wouldThisWorkHere(pos, hypoFireResult)){
				//console.log('' + leaf);
				return true;
			}
		}
		return false;
	},

	removeFromPossibleFireResults: function(possibleFireResults, removeArr){
		for(var i in removeArr){
			var index = possibleFireResults.indexOf(removeArr[i]);
			if(index != -1)
				possibleFireResults.splice(index, 1);
		}
	}
*/
};
