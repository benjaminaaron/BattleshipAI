

var ShipType = function(size, color, quantity){
	this.size = size;
	this.color = color;
	this.quantity = quantity;
}

var Ship = function(board, id, size, color){ 
    this.board = board;
    this.id = id;
    this.size = size;
    this.color = color;
}

Ship.prototype = {
    draw: function(svgContainer, x, y, orientation, cellSizePx, shrink, roundedCorner, dragReportingInstance){

        this.orientation = orientation; //true is horizontal, false is vertical
        this.wHoriz = cellSizePx * this.size - shrink;
        this.hHoriz = cellSizePx - shrink;
        this.wVert = this.hHoriz;
        this.hVert = this.wHoriz;

        var self = this;

        this.img = svgContainer.append('rect')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('rx', roundedCorner)
                    .attr('ry', roundedCorner)
                    .attr('width', orientation ? this.wHoriz : this.wVert)
                    .attr('height', orientation ? this.hHoriz : this.hVert)
                    .attr('fill', this.color)
                    .attr('opacity', 0.8)
                    .attr('id', this.id)
                    .call(d3.behavior.drag().on('dragstart', dragMonitor.dragstart)
                    						.on('drag', dragMonitor.dragging)
                    						.on('dragend', dragMonitor.dragend)); 
    },
    move: function(x, y){
    },
    reposition: function(){
    },
    flipOrientation: function(){
    },
    toString: function(){}
};


var dragMonitor = {
    dragstart: function(){
    	var shipID = d3.select(this).attr('id');
    	var board = game.boards[shipID.split('-')[0]];
    	var ship = board.ships[shipID.split('-')[1]];
    	console.log(board);
    	console.log(ship);
    }, 
    dragging: function(){
    	var x = d3.event.x;
	  	var y = d3.event.y;
	  	console.log(x + '  ' + y);
   	},
   	dragend: function(){
   		console.log('dragend');
   	}
}