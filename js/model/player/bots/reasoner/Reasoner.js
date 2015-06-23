var Reasoner = function(shipTypes){ //extends AbstractStragety?
	this.graph;
    this.ships = [];
    for(var i = 0; i < shipTypes.length; i++)
        for(var j = 0; j < shipTypes[i].quantity; j++)
            this.ships.push(shipTypes[i].size);
    this.ships.sort(sortDesc);
};

Reasoner.prototype = {
	loadField: function(field){
		this.graph = new Graph(field, this.ships);
		this.graph.generate();
	}
};
