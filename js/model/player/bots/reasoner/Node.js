var Node = function(ID, field, isLeaf){
	this.ID = ID;
	this.field = field;
	this.level;
	this.parent;
	this.children = [];
	this.isLeaf = isLeaf;
};

Node.prototype = {

	setParent: function(parent){
		this.parent = parent;
		this.level = parent.level + 1;
	},

	addChild: function(child){
		this.children.push(child);
	},

	removeChild: function(child){
		var index = $.inArray(child, this.children);
		this.children.splice(index, 1);
	},

	hasChildren: function(){
		return this.children.length > 0;
	},

	toString: function(){
		return 'node_' + this.ID + '\n' + this.field;
	},

	getLabel: function(){
		return '' + this;
	}

};
