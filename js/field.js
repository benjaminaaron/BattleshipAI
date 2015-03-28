
var Cell  = function(row, col){
    this.row = row;
    this.col = col;
    this.occupied = null;
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
    draw: function(ctx, cellSizePx, startX, startY){    

        //border around field
        ctx.strokeStyle = 'gray';  
        ctx.lineWidth = 2;
        ctx.rect(startX, startY, this.totalCols * cellSizePx, this.totalRows * cellSizePx);
        ctx.stroke();

        // grid & labels
        ctx.strokeStyle = 'silver'; 
        ctx.lineWidth = 1;
        ctx.fillStyle = 'gray';
        ctx.font = '12px arial';           
        for(var i=0; i <= this.totalRows; i++){
            var yPos = startY + i * cellSizePx;
            ctx.beginPath();
            ctx.moveTo(startX, yPos);
            ctx.lineTo(startX + this.totalCols * cellSizePx, yPos);
            ctx.stroke();
            if(i < this.totalRows)
                ctx.fillText((i+1), startX + ((i+1) < 10 ? -16 : -20), yPos + 14);
        }
        for(var i=0; i <= this.totalCols; i++){
            var xPos = startX + i * cellSizePx;
            ctx.beginPath();
            ctx.moveTo(xPos, startY);
            ctx.lineTo(xPos, startY + this.totalRows * cellSizePx);
            ctx.stroke();
            if(i < this.totalCols)
                ctx.fillText(String.fromCharCode('A'.charCodeAt() + i), xPos + 6, startY - 8);     
        }
    }
}
