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

		return this.graph.getLeavesCount();
	},

	generateScenarios: function(){
		var shootablePositions = this.inputfield.getShootablePositions();

		var equallyBestFirePos = [];
		var maxShotValue = -1;

		for(var i in shootablePositions){
			var firePos = shootablePositions[i];

			var shotValue = getShotValueApproach2(firePos, this.graph.getLeaves(), this.inputfield);
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
	}
/*
	getPruningValue: function(pos){
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

		var sum = 0;
		var nonZeros = 0;
		var maxPruning = -1;

		for(var i in counters)
			if(counters[i] != 0){
				var pruningVal = leaves.length - counters[i];

				if(i == 3 && pruningVal == 0)
					pruningVal = leaves.length;

				if(i == 2 && pruningVal == 0)
					pruningVal = leaves.length * 0.8;

				if(pruningVal > maxPruning)
					maxPruning = pruningVal;

				sum += pruningVal;
				nonZeros ++;
			}
		var pruningAverage = sum / nonZeros;


		var maxPruningFactor = pruningAverage / 10;
		var hitBonusFactor = pruningAverage / 10;
		var destroyedBonusFactor = pruningAverage / 5;
		var mineFactor = - pruningAverage / 1;

		var maxPruningBonus = maxPruning * maxPruningFactor;
		var hitBonus = counters[2] * hitBonusFactor;
		var destroyedBonus = counters[3] * destroyedBonusFactor;
		var minePunishment = counters[5] * mineFactor;

		var pruningValue = pruningAverage + maxPruningBonus + hitBonus + destroyedBonus + minePunishment;


		//TODO outsource to new utils-func for debugging
		var str = 'fire pos ' + pos + ' at ' + leaves.length + ' leaves, possibleFireResults: ' + CellArrToStr(possibleFireResults) + '\n';
		str += 'FIRED: ' + counters[0] + (counters[0] == 0 ? '' : ' -> ' + (leaves.length - counters[0])) + '\n';
		str += 'WAVE: ' + counters[1] + (counters[1] == 0 ? '' : ' -> ' + (leaves.length - counters[1])) + '\n';
		str += 'HIT: ' + counters[2] + (counters[2] == 0 ? '' : ' -> ' + (leaves.length - counters[2])) + '\n';
		str += 'DESTROYED: ' + counters[3] + (counters[3] == 0 ? '' : ' -> ' + (leaves.length - counters[3])) + '\n';
		str += 'RADIATION: ' + counters[4] + (counters[4] == 0 ? '' : ' -> ' + (leaves.length - counters[4])) + '\n';
		str += 'MINE: ' + counters[5] + (counters[5] == 0 ? '' : ' -> ' + (leaves.length - counters[5])) + '\n';
		str += 'WAVE_RADIATION: ' + counters[6] + (counters[6] == 0 ? '' : ' -> ' + (leaves.length - counters[6])) + '\n';
		str += '>> pruningValue: ' + pruningValue + ' (pruningAverage: ' + pruningAverage + ', maxPruningBonus: ' + maxPruningBonus + ', hitBonus: ' + hitBonus + ', destroyedBonus: ' + destroyedBonus + ', minePunishment: ' + minePunishment + ')';
		//console.log(str);

		return pruningValue;
	},*/

};
