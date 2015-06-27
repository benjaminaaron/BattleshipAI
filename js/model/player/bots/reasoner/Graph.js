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

	console.log('' + this.rootnode.toString('\n'));
	console.log('');
};

Graph.prototype = {

	generate: function(){
		var parentNodes = [this.rootnode];

		while(this.ships.length > 0){
			var shipsize = this.ships.splice(0, 1)[0];
			var onLeaflevel = this.ships.length == 0;

			console.log('looking at ship: ' + shipsize);
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
						console.log('' + childNode.toString('\n'));
						childNode.setParent(parentNode);
						parentNode.addChild(childNode);
						this.nodes.push(childNode);
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
	},

	hasIdenticalTwin: function(siblingnodes, newsiblingfield){
		for(var i in siblingnodes){
			if(newsiblingfield.isIdenticalTo(siblingnodes[i].field))
				return true;
		}
		return false;
	},

	getNodesAtLevel: function(level){
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

	show: function(newlineChar){
		for(var i in this.nodes)
			if(this.nodes[i].isLeaf)
				document.write(this.nodes[i].toString(newlineChar) + newlineChar);
	},

	export: function(){
		new GraphmlExporter(this.nodes);
	}

};
