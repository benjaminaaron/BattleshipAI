var Reasoner = function(shipTypes){ //extends AbstractStragety?
	this.graph;
    this.ships = [];
    for(var i = 0; i < shipTypes.length; i++)
        for(var j = 0; j < shipTypes[i].quantity; j++)
            this.ships.push(shipTypes[i].size);
    this.ships.sort(sortDesc);
};

Reasoner.prototype = {

	loadField: function(inputfield){
		this.inputfield = inputfield;

		var destroyedShips = inputfield.getDestroyedShips();


		//this.graph = new Graph(inputfield, this.ships);
		//this.graph.generate();
	},

	generateScenarios: function(){
		var shootableCells = this.inputfield.getShootablePositions();

		//TODO loop through shootable cells

		var hypoFirePos = shootableCells[0];

		// TODO loop through fire-result-options

		var hypoFireResult = Cell.FIRED;   //FIRED, WAVE, HIT, DESTROYED
		
	}
	
};
