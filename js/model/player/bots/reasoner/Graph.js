var Graph = function(rootfield, ships){
	this.rows = rootfield.rows;
	this.cols = rootfield.cols;

	this.rootnode = new Node(0, rootfield);
	this.rootnode.parent = null;
	this.rootnode.level = 0;

	this.ships = ships;

	this.nodes = [this.rootnode];
};

Graph.prototype = {
	generate: function(){
		var parentNodes = [this.rootnode];

		while(this.ships.length > 0){
			var shipsize = this.ships.splice(0, 1)[0];
			//console.log('looking at ship: ' + shipsize);
			var collectNextLevel = [];

			for(i in parentNodes){
				var parentNode = parentNodes[i];
				var parentField = parentNode.field;
				var validpositions = parentField.getValidPositions(shipsize);
				
				for(j in validpositions){
					var validPos = validpositions[j];
					var childField = parentField.copy();
					childField.place(validPos);
					var childNode = new Node(this.nodes.length, childField);
					//console.log('' + childNode);
					childNode.setParent(parentNode);
					this.nodes.push(childNode);
				}
				collectNextLevel = collectNextLevel.concat(parentNode.children);
			}
			parentNodes = collectNextLevel;
		}

		// TODO first prune-stage: checkWaveValidity()

	},
	show: function(){
		console.log('nodes:');
		console.log(this.nodes);
		console.log('edges:');
		console.log(this.edges);
	},
	export: function(){
		new GraphmlExporter(this.nodes, this.edges);
	}
};
