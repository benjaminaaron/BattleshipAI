var Edge = function(parent, child){
	this.parent = parent;
	this.child = child;
}

Edge.prototype = {
	toString: function(){
		return '[' + this.parent.ID + ' -> ' + this.child.ID + ']';
	}
}