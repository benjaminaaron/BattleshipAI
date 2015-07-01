var Reasoner = function(shipTypes){ //extends AbstractStragety?
	this.graph;
    this.ships = [];
    for(var i = 0; i < shipTypes.length; i++)
        for(var j = 0; j < shipTypes[i].quantity; j++)
            this.ships.push(shipTypes[i].size);
    this.ships.sort(sortDesc);
	this.allShips = this.ships.slice();

	// decide about the weight algo here
	this.weightAlgo = getShotWeightedValue; //getPruningValue
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

		return this.graph.getLeavesCount();
	},

	generateScenarios: function(){
		var shootablePositions = this.inputfield.getShootablePositions();

		var equallyBestFirePos = [];
		var maxShotValue = -1;

		for(var i in shootablePositions){
			var firePos = shootablePositions[i];

			var shotValue = this.getShotValue(firePos);
			console.log('\n\shotValue for pos ' + firePos + ': ' + shotValue);

			if(shotValue > maxShotValue){
				maxShotValue = shotValue;
				equallyBestFirePos = [];
			}
			if(shotValue == maxShotValue)
				equallyBestFirePos.push(firePos);
		}

		var chosenFirePos = equallyBestFirePos[Math.floor(Math.random() * equallyBestFirePos.length)];

		console.log(equallyBestFirePos);
		console.log(chosenFirePos);
	},

	getShotValue: function(pos){
		//var allPossibleFireResults = [Cell.FIRED, Cell.WAVE, Cell.HIT, Cell.DESTROYED, Cell.RADIATION, Cell.MINE, Cell.WAVE_RADIATION];

		var leaves = this.graph.getLeaves();

		var possibleFireResults = [];
		for(var i in leaves){
			var leaf = leaves[i];
			//console.log('' + leaf);
			var newPossibleFireResult = leaf.field.whatCouldBeHere(pos, this.inputfield);
			//console.log(CellArrToStr(newPossibleFireResults));
			possibleFireResults.push(newPossibleFireResult);
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

		return this.weightAlgo(counters, leaves.length);
	},

};
