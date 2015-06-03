var Ship = function(size){
	this.size = size;
	this.headRow;
	this.headCol;
	this.orientation; // true=horizontal, false=vertical;
}

module.exports = Ship;