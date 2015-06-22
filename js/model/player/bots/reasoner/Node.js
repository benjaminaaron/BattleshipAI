var Node = function(ID, field){
	this.ID = ID;
	this.field = field;
	this.level;
	this.parent;
	this.children = [];
};

Node.prototype = {
	setParent: function(parent){
		this.parent = parent;
		parent.children.push(this);
		this.level = parent.level + 1;
	},
	toString: function(){
		return 'node_' + this.ID + '\n' + this.field;
	},
	getLabel: function(){
		return this.toString();
	}
};