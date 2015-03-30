
var Board = function(id, player, shipTypes, canvas, xDim, yDim){
    this.id = id;
    this.player = player;
    this.iAmActiveBoard = false;

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

    $(canvas).on('mousedown touchstart', function(e) {
        if(self.iAmActiveBoard){
            e.preventDefault();
            var canvasElement = canvas.getBoundingClientRect(); // rect.top, rect.right, rect.bottom, rect.left
            var xMouse = e.originalEvent.pageX - canvasElement.left;
            var yMouse = e.originalEvent.pageY - canvasElement.top;
            self.mousedown(xMouse, yMouse);
        }
    });
    $(canvas).on('mousemove touchmove', function(e) {
        if(self.iAmActiveBoard){ 
            e.preventDefault();
            var canvasElement = canvas.getBoundingClientRect();
            var xMouse = e.originalEvent.pageX - canvasElement.left;
            var yMouse = e.originalEvent.pageY - canvasElement.top;
            self.mousemove(xMouse, yMouse);
        }
    });
    $(canvas).on('mouseup touchend', function(e) {
        if(self.iAmActiveBoard){
            e.preventDefault();
            self.mouseup();
        }
    });

    this.ctx = $(canvas)[0].getContext('2d');
    this.drawMe = false;
    this.oneMoreDraw = false;
}

Board.prototype = {
    draw: function(){
            var ctx = this.ctx;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
/*
            // board frame
            ctx.strokeStyle = 'black';     
            ctx.lineWidth = 1;
            ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);  
*/ 
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
    mousedown: function(xMouse, yMouse){
        var ship = this.getSelectedShip(xMouse, yMouse); //console.log(this.selectedShip);     
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
    mousemove: function(xMouse, yMouse){ //console.log(e.offsetX + '  ' + e.offsetY);
        if(this.selectedShip != null){
            var ship = this.selectedShip;
            ship.moveTo(xMouse, yMouse);

            if(this.shipIsCompletelyOverField(ship)) //console.log('ship completely over field');
                this.handleShipMovesOverField(ship, ship.x - this.xOffset, ship.y - this.yOffset);                

            if(this.shipTouchesRotationSwitch(ship)) //console.log('ship over rotation flip');
                if(ship.nextFlipAllowed){
                    ship.flipOrientation();
                    ship.nextFlipAllowed = false;
                }
        }  
    },
    mouseup: function(){
        var ship = this.selectedShip;
        if(ship != null){
            ship.movingStopped();
            this.placeShip();
            this.selectedShip = null; 
            this.drawMe = false;
            this.oneMoreDraw = true; 
        }  
    },  
    shipIsCompletelyOverField: function(ship){
        return ship.x > this.xOffset && ship.x < this.rightEdgeOfFieldX - ship.w && ship.y > this.yOffset && ship.y < this.bottomEdgeOfFieldY - ship.h;
    },
    shipTouchesRotationSwitch: function(ship){
        return ship.y < this.rotSwitchY + this.rotSwitchSize && ship.y + ship.h > this.rotSwitchY && ship.x < this.rotSwitchX + this.rotSwitchSize && ship.x + ship.w > this.rotSwitchX;
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
        if(this.allCellsFree(ship.size, ship.orientation, row, col)){
            for(var i=0; i < ship.size; i++)
                cells.push(this.field.getCellByRowCol(row + (ship.orientation ? 0 : i), col + (ship.orientation ? i : 0)));
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
    },
    placeShipByCoords: function(ship, orientation, row, col){     
        if(ship.orientation != orientation)
            ship.flipOrientation();
        ship.x = this.xOffset + col * this.cellSizePx;
        ship.y = this.yOffset + row * this.cellSizePx;
        for(var i=0; i < ship.size; i++){
            var cell = this.field.getCellByRowCol(row + (orientation ? 0 : i), col + (orientation ? i : 0));
            cell.occupiedBy = ship;
            ship.occupyingCells.push(cell); 
        }
        this.oneMoreDraw = true; 
        initDraw();
    },
    randomlyPlaceShips: function(){
        this.clearShipPositions();
/*      
        var unplacedShips = [];
        for(var i=0; i < this.ships.length; i++)
            if(this.ships[i].occupyingCells.length == 0)
                unplacedShips.push(this.ships[i]);
*/
        for(var i=0; i < this.ships.length; i++){
            var ship = this.ships[i];
            var validPositions = [];
            // add horizontal valid positions
            for(var row=0; row < this.yDim; row++)
                for(var col=0; col < this.xDim - ship.size + 1; col++)
                    if(this.allCellsFree(ship.size, true, row, col))
                        validPositions.push(new GridPos(true, row, col));
            // add vertical valid positions
            for(var row=0; row < this.yDim - ship.size + 1; row++)
                for(var col=0; col < this.xDim; col++)
                    if(this.allCellsFree(ship.size, false, row, col))
                        validPositions.push(new GridPos(false, row, col));

            var randomIndex = Math.round(Math.random() * (validPositions.length - 1)); //if no valid positions available this goes negative and throws an error
            var randomGridPos = validPositions[randomIndex];
            this.placeShipByCoords(ship, randomGridPos.orientation, randomGridPos.row, randomGridPos.col);
        }
    },
    allCellsFree: function(shipSize, orientation, rowHead, colHead){
        for(var i=0; i < shipSize; i++){
            var cell = this.field.getCellByRowCol(rowHead + (orientation ? 0 : i), colHead + (orientation ? i : 0));
            if(cell.occupiedBy != null)
                return false;
        }
        return true;
    },
    clearShipPositions: function(){
        for(var i=0; i < this.field.cells.length; i++)
            this.field.cells[i].occupiedBy = null;
        for(var i=0; i < this.ships.length; i++)
            this.ships[i].occupyingCells = []; 
    }
};
