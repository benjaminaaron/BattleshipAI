var Graph = function(rootfield, ships){
	this.rows = rootfield.rows;
	this.cols = rootfield.cols;

	this.rootnode = new Node(0, rootfield);
	this.rootnode.parent = null;
	this.rootnode.level = 0;

	this.ships = ships;

	this.nodes = [this.rootnode];
	this.edges = [];
};

Graph.prototype = {
	generate: function(){

		var parentNodes = [this.rootnode];

		while(this.ships.length > 0){
			var shipsize = this.ships.splice(0, 1)[0];

			var collectNextLevel = [];

			for(i in parentNodes){
				var parentNode = parentNodes[i];

				var parentField = parentNode.field;
				var validpositions = parentField.getValidPositions(shipsize);
				
				for(j in validpositions){
					var validPos = validpositions[j];
					var childField = parentField.copy();
					childField.place(shipsize, validPos);
					var childNode = new Node(this.nodes.length, childField);
					console.log('' + childNode);
					childNode.setParent(parentNode);
					this.nodes.push(childNode);
					this.edges.push(new Edge(parentNode, childNode));
				}
				collectNextLevel = collectNextLevel.concat(parentNode.children);
			}
			parentNodes = collectNextLevel;
		}
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

/*
var node1 = new Node(this.nodes.length);
node1.setParent(this.root);
this.edges.push(new Edge(this.root, node1));
this.nodes.push(node1);

var node2 = new Node(this.nodes.length);
node2.setParent(this.root);
this.edges.push(new Edge(this.root, node2));
this.nodes.push(node2);		

var node3 = new Node(this.nodes.length);
node3.setParent(node1);
this.edges.push(new Edge(node1, node3));
this.nodes.push(node3);		
*/