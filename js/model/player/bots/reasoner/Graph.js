var Graph = function(){
	this.root = new Node(0);
	this.root.parent = null;
	this.root.level = 0;

	this.nodes = [this.root];
	this.edges = [];
}

Graph.prototype = {
	generate: function(){
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
	},
	show: function(){
		console.log(this.nodes);
		console.log(this.edges);
	},
	export: function(){
		new GraphmlExporter(this.nodes, this.edges);
	}
}