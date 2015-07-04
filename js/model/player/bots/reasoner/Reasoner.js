var Reasoner = function(shipTypes, inputfield){ //extends AbstractStragety?
	this.graph;
    this.ships = [];
    for(var i = 0; i < shipTypes.length; i++)
        for(var j = 0; j < shipTypes[i].quantity; j++)
            this.ships.push(shipTypes[i].size);
    this.ships.sort(sortDesc);
	this.allShips = this.ships.slice();

	// decide about the weight algo here
	this.weightAlgo = this.getShotWeightedValue; //this.getPruningValue

	//console.log('inputfield:\n' + inputfield + '\nships: ' + this.allShips);// + '\n\npossible setups:\n\n');

	var leavesCount = this.loadField(inputfield);
	//this.graph.showLeaves();

	this.chosenFirePos = null;

	if(leavesCount == 1)
		this.getOneOfRemainingTargetsPos();
	else
		this.generateScenarios();
};

Reasoner.prototype = {

	getOneOfRemainingTargetsPos(){
		var targetsPos = this.graph.getLeaves()[0].field.getRemainingTargetsPos(this.inputfield);
		this.chosenFirePos = targetsPos[Math.floor(Math.random() * targetsPos.length)];
	},

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
			//console.log('\n\shotValue for pos ' + firePos + ': ' + shotValue);

			if(shotValue > maxShotValue){
				maxShotValue = shotValue;
				equallyBestFirePos = [];
			}
			if(shotValue == maxShotValue)
				equallyBestFirePos.push(firePos);
		}

		this.chosenFirePos = equallyBestFirePos[Math.floor(Math.random() * equallyBestFirePos.length)];
	},

	getShotValue: function(pos){
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

// two WEIGHTALGOs

	getShotWeightedValue: function(counters, leavesCount){
		var weights = characters['bloody'];

		var shotValue = 0;
		for(var i in counters)
				shotValue += counters[i] * weights[i];

		return shotValue;
	},

	getPruningValue: function(counters, leavesCount){
	    var sum = 0;
	    var nonZeros = 0;

	    for(var i in counters)
	    if(counters[i] != 0){
	        sum += leavesCount - counters[i];
	        nonZeros ++;
	    }

			var pruningAverage = sum / nonZeros;

			/*
    	var str = 'FIRED: ' + counters[0] + (counters[0] == 0 ? '' : ' -> ' + (leavesCount- counters[0])) + '\n';
    	str += 'WAVE: ' + counters[1] + (counters[1] == 0 ? '' : ' -> ' + (leavesCount - counters[1])) + '\n';
    	str += 'HIT: ' + counters[2] + (counters[2] == 0 ? '' : ' -> ' + (leavesCount- counters[2])) + '\n';
    	str += 'DESTROYED: ' + counters[3] + (counters[3] == 0 ? '' : ' -> ' + (leavesCount - counters[3])) + '\n';
    	str += 'RADIATION: ' + counters[4] + (counters[4] == 0 ? '' : ' -> ' + (leavesCount - counters[4])) + '\n';
    	str += 'MINE: ' + counters[5] + (counters[5] == 0 ? '' : ' -> ' + (leavesCount- counters[5])) + '\n';
    	str += 'WAVE_RADIATION: ' + counters[6] + (counters[6] == 0 ? '' : ' -> ' + (leavesCount - counters[6])) + '\n';
    	str += '>> pruningAverage: ' + pruningAverage;
    	console.log(str);
			*/

	  return pruningAverage;
	}

};

var characters = {
    'bloody': [5/7, 4/7, 6/7, 7/7, 2/7, 1/7, 3/7],
    'sadist': [5/7, 4/7, 7/7, 6/7, 2/7, 1/7, 3/7],
    'masochist': [4/7, 3/7, 2/7, 1/7, 6/7, 7/7, 5/7]
};
