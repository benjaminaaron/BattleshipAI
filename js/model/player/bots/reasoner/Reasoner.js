var Reasoner = function(shipTypes, inputfield, cap){ //extends AbstractStragety?
	this.graph;
    this.ships = [];
    for(var i = 0; i < shipTypes.length; i++)
        for(var j = 0; j < shipTypes[i].quantity; j++)
            this.ships.push(shipTypes[i].size);
    this.ships.sort(sortDesc);
	this.allShips = this.ships.slice();

	// decide about the weight algo here
	this.weightAlgo = this.getPruningValue; //this.getShotWeightedValue
	if(Driver.verboseLogging)
		console.log('inputfield:\n' + inputfield + '\nships/mines: ' + this.allShips);// + '\n\npossible setups:\n\n');

	this.inputfield = inputfield;
	var leavesCount = this.loadField(cap); // -1 in case of not ranThrogh
	//this.graph.showLeaves();

	this.assessment = {
		'allShips' : this.allShips,
		'undestroyedShips' : this.undestroyedShips,
		'leavesCount' : leavesCount,
		'weightAlgo' : 'getPruningValue',
		'chosenFirePos' : null,
		'equallyBestFirePos_length' : -1,
		'mode' : null,
		'remainingTargets' : null,
		'reachedCap' : false //cancelled
	};

	if(leavesCount != -1){ //signal for cap was reached
		if(leavesCount == 1)
			this.getOneOfRemainingTargetsPos();
		else
			this.generateScenarios();
	} else
		this.assessment['reachedCap'] = true;

	//this.graph.export();
};

Reasoner.prototype = {

	getAssessment: function(){
		return this.assessment;
	},

	getOneOfRemainingTargetsPos: function(){
		var targetsPos = this.graph.getLeaves()[0].field.getRemainingTargetsPos(this.inputfield);
		var chosenFirePos = targetsPos[Math.floor(Math.random() * targetsPos.length)];

		this.assessment['mode'] = 'fireRemainingTargets';
		this.assessment['remainingTargets'] = targetsPos.length;
		this.assessment['chosenFirePos'] = chosenFirePos;
	},

	loadField: function(cap){
		var destroyedShips = this.inputfield.getDestroyedShips();

		for(var i in destroyedShips)
			this.ships.splice(this.ships.indexOf(destroyedShips[i].size), 1);

		for(var i = 0; i < this.inputfield.getMinesCount(); i ++)
			this.ships.splice(this.ships.indexOf(1), 1);

		this.undestroyedShips = this.ships.slice(); // makes a copy
		if(Driver.verboseLogging)
			console.log('undestroyed ships/mines: ' + this.undestroyedShips);

		this.graph = new Graph(this.inputfield, this.ships);

		var ranThrough = this.graph.generate(cap);

		if(ranThrough)
			return this.graph.getLeavesCount();
		else
			return -1;
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

		var chosenFirePos = equallyBestFirePos[Math.floor(Math.random() * equallyBestFirePos.length)];

		this.assessment['mode'] = 'reasoning';
		this.assessment['equallyBestFirePos_length'] = equallyBestFirePos.length;
		this.assessment['chosenFirePos'] = chosenFirePos;
	},

	getShotValue: function(pos){
		var leaves = this.graph.getLeaves();

		var possibleFireResults = [];
		for(var i in leaves){
			var leaf = leaves[i];
			//console.log('' + leaf);
			var newPossibleFireResult = leaf.field.whatCouldBeHere(pos, this.inputfield);
			//console.log(RCellArrToStr(newPossibleFireResult));
			possibleFireResults.push(newPossibleFireResult);
		}

		var counters = [0, 0, 0, 0, 0, 0, 0];

		for(var i in possibleFireResults){
			switch(possibleFireResults[i]){
				case RCell.FIRED:
					counters[0] ++;
					break;
				case RCell.WAVE:
					counters[1] ++;
					break;
				case RCell.HIT:
					counters[2] ++;
					break;
				case RCell.DESTROYED:
					counters[3] ++;
					break;
				case RCell.RADIATION:
					counters[4] ++;
					break;
				case RCell.MINE:
					counters[5] ++;
					break;
				case RCell.WAVE_RADIATION:
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
