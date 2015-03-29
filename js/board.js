
var Board = function(id, player, shipTypes, canvas, xDim, yDim){
    this.id = id;
    this.player = player;

    this.xDim = xDim;
    this.yDim = yDim;
    this.xOffset = 30;
    this.yOffset = 60;
    this.cellSizePx = 20;

    this.field = new Field(xDim, yDim);

    this.rightEdgeOfFieldX = this.xOffset + this.xDim * this.cellSizePx;
    this.bottomEdgeOfFieldY = this.yOffset + this.yDim * this.cellSizePx;

    // rotation switch
    this.rotSwitchX = this.rightEdgeOfFieldX + 30; 
    this.rotSwitchY = this.yOffset - 40;
    this.rotSwitchSize = 30;

    //add ships as defined in shipTypes
    this.ships = [];
    for(var i=0; i < shipTypes.length; i++)
    	for(var j=0; j < shipTypes[i].quantity; j++){
            var ship = new Ship(this, id + '-' + this.ships.length, shipTypes[i].size, shipTypes[i].color);
            ship.initPlacement(this.ships.length, true, this.cellSizePx, this.rightEdgeOfFieldX, this.yOffset);
    		this.ships.push(ship);
        }

    this.selectedShip = null;
    var self = this;
    $(canvas).mousedown(function(e){
        self.mousedown(e);
    });
    $(canvas).mousemove(function(e){
        self.mousemove(e);
    });
    $(canvas).mouseup(function(e){
        self.mouseup(e);
    });

    this.ctx = canvas.getContext('2d');
    this.drawMe = false;
    this.oneMoreDraw = false;
}

Board.prototype = {
    draw: function(){
            var ctx = this.ctx;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 

            // board frame
            ctx.strokeStyle = 'black';     
            ctx.lineWidth = 1;
            ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);   

            // name
            ctx.fillStyle = 'navy';
            ctx.font = '20px georgia';       
            ctx.fillText(this.player.name, this.xOffset, this.yOffset - 30);

            // field
            this.field.draw(this.ctx, this.xOffset, this.yOffset, this.cellSizePx);
            
            // ships
            for(var i=0; i < this.ships.length; i++)
                this.ships[i].draw(ctx);

            //rotation switch
            ctx.fillStyle = '#DDD';    
            ctx.fillRect(this.rotSwitchX, this.rotSwitchY, this.rotSwitchSize, this.rotSwitchSize); 
            ctx.fillStyle = 'gray';
            ctx.font = '14px georgia';       
            ctx.fillText('R', this.rotSwitchX + 10, this.rotSwitchY + 20);
    },
    mousedown: function(e){
        var ship = this.getSelectedShip(e.offsetX, e.offsetY); //console.log(this.selectedShip);     
        if(ship){
            for(var i=0; i < ship.occupyingCells.length; i++)    
                ship.occupyingCells[i].occupiedBy = null;
            this.field.cellBundleHoverAction(ship.occupyingCells, ship); // leaves a shadow-footprint from the last position, in that way it's not possible for ships that were dragged again from the field-border to loose their last position
            ship.occupyingCells = [];  
            this.selectedShip = ship;
            this.drawMe = true;
            initDraw();
        }
    },
    mousemove: function(e){ //console.log(e.offsetX + '  ' + e.offsetY);
        if(this.selectedShip != null){
            var ship = this.selectedShip;
            var x = e.offsetX;
            var y = e.offsetY;

            ship.moveTo(x, y);

            if(this.shipIsCompletelyOverField(ship)) //console.log('ship completely over field');
                this.handleShipMovesOverField(ship, ship.x - this.xOffset, ship.y - this.yOffset);                

            if(this.shipTouchesRotationSwitch(ship)) //console.log('ship over rotation flip');
                if(ship.nextFlipAllowed){
                    ship.flipOrientation();
                    ship.nextFlipAllowed = false;
                }
        }  
    },  
    shipIsCompletelyOverField: function(ship){
        return ship.x > this.xOffset && ship.x < this.rightEdgeOfFieldX - ship.w && ship.y > this.yOffset && ship.y < this.bottomEdgeOfFieldY - ship.h;
    },
    shipTouchesRotationSwitch: function(ship){
        return ship.y < this.rotSwitchY + this.rotSwitchSize && ship.y + ship.h > this.rotSwitchY && ship.x < this.rotSwitchX + this.rotSwitchSize && ship.x + ship.w > this.rotSwitchX;
    },
    mouseup: function(e){
        var ship = this.selectedShip;
        if(ship != null){
            ship.movingStopped();
            this.placeShip();
            this.selectedShip = null; 
            this.drawMe = false;
            this.oneMoreDraw = true; 
        }  
    },
    shiftKeyDownEvent: function(){
        var ship = this.selectedShip;
        if(ship)
            ship.flipOrientation();
    },
    getSelectedShip: function(x, y){
        for(var i=0; i < this.ships.length; i++)
            if(this.ships[i].isOnMe(x,y))
                return this.ships[i];
        return null;
    },
    handleShipMovesOverField: function(ship, relXpos, relYpos){
        var row, col;
        if(ship.orientation){
            col = Math.round(relXpos / this.cellSizePx);
            row = Math.round(relYpos / this.cellSizePx);
            //console.log(row + '  ' + col);
        } else {
            col = Math.round(relXpos / this.cellSizePx);
            row = Math.round(relYpos / this.cellSizePx);
            //console.log(row + '  ' + col);
        }
        var cells = [];
        var allCellsFree = true;
        for(var i=0; i < ship.size; i++){
            var cell = this.field.getCellByRowCol(row + (ship.orientation ? 0 : i), col + (ship.orientation ? i : 0));
            cells.push(cell);
            if(cell.occupiedBy != null)
                allCellsFree = false;
        }
        if(allCellsFree){
            this.field.cellBundleHoverAction(cells, ship);
        } else
            cells = [];
    },
    placeShip: function(){
        var bundlesFirstCell = this.field.placeLastCellBundleMemory();
        if(bundlesFirstCell != null){
            var ship = bundlesFirstCell.occupiedBy;
            if(ship.orientation != bundlesFirstCell.orientationWhileHovering)
                ship.flipOrientation();
            ship.x = this.xOffset + bundlesFirstCell.col * this.cellSizePx;
            ship.y = this.yOffset + bundlesFirstCell.row * this.cellSizePx;
        }
    }
};
