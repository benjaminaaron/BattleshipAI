

var Board = function(id, player, shipTypes){
    this.id = id;
    this.player = player;
    this.field;

    //add ships as defined in shipTypes
    this.ships = [];
    for(var i=0; i < shipTypes.length; i++)
    	for(var j=0; j < shipTypes[i].quantity; j++)
    		this.ships.push(new Ship(this, id + '-' + this.ships.length, shipTypes[i].size, shipTypes[i].color));
}

Board.prototype = {
    draw: function(svgContainerParent, width, height){
        var svgContainer = d3.select(svgContainerParent).append('svg')
                            .attr('width', width)
                            .attr('height', height)
                            .attr('id', 'canvas_' + this.id);

        // border around board
        svgContainer.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'none')
            .attr('stroke', 'silver')
            .attr('stroke-width', '1');

        // FIELD
        var totalRows = 10;
        var totalCols = 10;
        var xOffset = 40;
        var yOffset = 70;
        var cellSizePx = 20;
        this.field = new Field(totalRows, totalCols);
        this.field.draw(svgContainer, cellSizePx, xOffset, yOffset);

        // NAME
        svgContainer.append('text')
            .attr('x', xOffset - 10)
            .attr('y', yOffset - 35)
            .attr('font-family', 'arial')
            .attr('font-size', '20px')
            .attr('font-weight', 'bold')
            .attr('fill', 'navy')
            .text(this.player.name);

        // SHIPS

        var roundedCorner = 10;
        var shrink = 6;

        for(var i=0; i < this.ships.length; i++){
        	var xPos = xOffset + totalCols * cellSizePx + 20;
        	var yPos = yOffset + i * 25;
        	this.ships[i].draw(svgContainer, xPos, yPos, true, cellSizePx, shrink, roundedCorner);
        }
    }
};
