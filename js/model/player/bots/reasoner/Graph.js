var Graph = function(inputfield, ships){
	this.rows = inputfield.rows;
	this.cols = inputfield.cols;

	this.rootnode = new Node(0, inputfield, false);
	this.rootnode.parent = null;
	this.rootnode.level = 0;

	this.ships = ships;

	this.nodes = [this.rootnode];

	this.wavesPos = inputfield.getWavesPos();
	this.hitPos = inputfield.getHitsPos();

	console.log('' + this.rootnode);
	console.log('');
};

Graph.prototype = {

	generate: function(){
		var parentNodes = [this.rootnode];

		var flaggedForDeletion = [];

		while(this.ships.length > 0){
			var shipsize = this.ships.splice(0, 1)[0];
			var onLeaflevel = this.ships.length == 0;

			console.log('looking at ship: ' + shipsize);
			var collectNextLevel = [];

			for(i in parentNodes){
				var parentNode = parentNodes[i];
				var parentField = parentNode.field;
				var validpositions = parentField.getValidPositions(shipsize);
				
				for(j in validpositions){
					var validPos = validpositions[j];
					var childField = parentField.copy();
					childField.place(validPos);

					var createChild = true;
					if(onLeaflevel)
						if(!childField.allSatisfied(this.wavesPos, this.hitPos))
							createChild = false;

					if(createChild){
						var childNode = new Node(this.nodes.length, childField, onLeaflevel);
						console.log('' + childNode);
						childNode.setParent(parentNode);
						this.nodes.push(childNode);
					}
				}
				collectNextLevel = collectNextLevel.concat(parentNode.children);
				
				if(!parentNode.hasChildren())
					flaggedForDeletion.push(parentNode);
			}
			parentNodes = collectNextLevel;
		}

		// PRUNING: delete all nodes that are not leaves and have no children
		for(i in flaggedForDeletion)
			this.deleteNode(flaggedForDeletion[i]);
	},

	deleteNode: function(node){
		var index = $.inArray(node, this.nodes);
		var delnode = this.nodes.splice(index, 1)[0];
		if(delnode.parent != null)
			delnode.parent.removeChild(delnode);
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
