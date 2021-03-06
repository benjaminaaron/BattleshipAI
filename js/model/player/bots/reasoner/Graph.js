var Graph = function(inputfield, ships){
	this.rows = inputfield.rows;
	this.cols = inputfield.cols;

	this.rootnode = new Node(0, inputfield, false);
	this.rootnode.parent = null;
	this.rootnode.level = 0;

	this.ships = ships;
	this.leafLevel = ships.length;

	this.nodes = [this.rootnode];

	this.wavesPos = inputfield.getWavesPos();
	this.hitsPos = inputfield.getHitsPos();
	this.radiationsPos = inputfield.getRadiationsPos();

	//console.log('' + this.rootnode.toString('\n'));
};

Graph.prototype = {

	generate: function(cap){
		var parentNodes = [this.rootnode];

		while(this.ships.length > 0){ //TODO recursive instead of top to bottom? checking for sibling-duplicates seems easier though this way
			var shipsize = this.ships.splice(0, 1)[0];
			var onLeaflevel = this.ships.length == 0;

			if(Driver.verboseLogging)
				console.log('looking at ' + (shipsize == 1 ? 'mine: ' : 'ship: ') + shipsize + ' (' + this.ships.length + ' remaining)');
			var collectNextLevel = [];

			for(var i in parentNodes){
				var parentNode = parentNodes[i];
				var parentField = parentNode.field;
				var validpositions = parentField.getValidPositions(shipsize);

				for(var j in validpositions){
					var validPos = validpositions[j];
					var childField = parentField.copy();

					childField.place(validPos);

					var createChild = true;
					if(onLeaflevel)
						if(!childField.allSatisfied(this.wavesPos, this.hitsPos, this.radiationsPos))
							createChild = false;

					if(createChild && this.hasIdenticalTwin(this.getNodesAtLevel(parentNode.level + 1), childField))
						createChild = false;

					if(createChild){
						var childNode = new Node(this.nodes.length, childField, onLeaflevel);
						//console.log('' + childNode.toString('\n'));
						childNode.setParent(parentNode);
						parentNode.addChild(childNode);
						this.nodes.push(childNode);

						if(this.nodes.length > cap)
							return false;
					}
				}

				collectNextLevel = collectNextLevel.concat(parentNode.children);
			}
			parentNodes = collectNextLevel;
		}

		// PRUNING: delete all nodes that are not leaves and have no children

		for(var level = this.leafLevel - 1; level > 0; level --){
			var levelnodes = this.getNodesAtLevel(level);
			var flaggedForDeletion = [];
			for(var i in levelnodes){
				var node = levelnodes[i];
				if(!node.isLeaf && !node.hasChildren())
					flaggedForDeletion.push(node);
			}
			for(var i in flaggedForDeletion)
				this.deleteNode(flaggedForDeletion[i]);
		}

		return true;
	},

	hasIdenticalTwin: function(siblingnodes, newsiblingfield){
		for(var i in siblingnodes)
			if(newsiblingfield.isIdenticalTo(siblingnodes[i].field))
				return true;
		return false;
	},

	getNodesAtLevel: function(level){ //TODO for performance store them in an array of level-arrays while generating instead of going through all every time
		var nodes = [];
		for(var i in this.nodes)
			if(this.nodes[i].level == level)
				nodes.push(this.nodes[i]);
		return nodes;
	},

	deleteNode: function(node){
		var index = $.inArray(node, this.nodes);
		var delnode = this.nodes.splice(index, 1)[0];
		if(delnode.parent != null)
			delnode.parent.removeChild(delnode);
	},

	getLeaves: function(){
		var leaves = [];
		for(var i in this.nodes)
			if(this.nodes[i].isLeaf)
				leaves.push(this.nodes[i]);
		return leaves;
	},

	getLeavesCount: function(){
		return this.getLeaves().length;
	},

	showLeaves: function(){
		var leaves = this.getLeaves();
		for(var i in leaves)
			if(Driver.verboseLogging)
				console.log(leaves[i] + '');
	},

	export: function(){
		new GraphmlExporter(this.nodes);
	}

};
