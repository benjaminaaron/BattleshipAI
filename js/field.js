

var Cell  = function(row, col){
    this.row = row;
    this.col = col;
    this.img;
}

var Field = function(totalRows, totalCols){
    this.totalRows = totalRows;
    this.totalCols = totalCols;
    this.cells = [];
    for(var i = 0; i < totalRows; i++)
        for(var j = 0; j < totalRows; j++)
            this.cells.push(new Cell(i, j));
    this.labels = [];
}

Field.prototype = {
    draw: function(svgContainer, cellSizePx, offsetX, offsetY){
    	svgContainer.append('rect')
            .attr('x', offsetX)
            .attr('y', offsetY)
            .attr('width', this.totalCols * cellSizePx)
            .attr('height', this.totalRows * cellSizePx)
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', '1.5');

        for(var i = 0; i < this.cells.length; i++) // attach the rect-element to every cell
            this.cells[i].img = svgContainer.append('rect')
                .attr('x', offsetX + this.cells[i].col * cellSizePx)
                .attr('y', offsetY + this.cells[i].row * cellSizePx)
                .attr('width', cellSizePx)
                .attr('height', cellSizePx)
                .attr('fill', 'white')
                .attr('stroke', 'silver')
                .attr('stroke-width', '1')
                .attr('id', 'cell_' + (this.cells[i].row + 1) + '-' + (this.cells[i].col + 1));

        for(var i = 0; i < this.totalRows; i++) // row labels
            svgContainer.append('text')
                .attr('x', offsetX - 18)
                .attr('y', i * cellSizePx + offsetY + 14)
                .attr('font-family', 'arial')
                .attr('font-size', '11px')
                .attr('fill', 'gray')
                .text(i + 1);

        for(var i = 0; i < this.totalRows; i++) // col labels
            svgContainer.append('text')
                .attr('x', offsetX + i * cellSizePx + 7)
                .attr('y', offsetY - 10)
                .attr('font-family', 'arial')
                .attr('font-size', '11px')
                .attr('fill', 'gray')
                .text(String.fromCharCode('A'.charCodeAt() + i));
    }
}
