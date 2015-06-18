var Node = function(ID){
	this.ID = ID;
	this.parent;
	this.level;
	this.fieldSnapshot;
}

Node.prototype = {
	setParent: function(parent){
		this.parent = parent;
		this.level = parent.level + 1;
	},
	toString: function(){
		return 'node_' + this.ID;
	}
}