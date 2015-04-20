
var Board = function(id, player, shipTypes, rows, cols){
    this.id = id;
    this.player = player;

    this.rows = rows;
    this.cols = cols;

    // field
    this.cellSizePx = 20;
    this.fieldLeft = 30;
    this.fieldTop = 60;
    this.fieldRight = this.fieldLeft + rows * this.cellSizePx;
    this.fieldBottom = this.fieldTop + cols * this.cellSizePx;    
    this.field = new Field(rows, cols, this.fieldLeft, this.fieldTop, this.cellSizePx);

    //add ships as defined in shipTypes
    this.ships = [];
    for(var i=0; i < shipTypes.length; i++)
        for(var j=0; j < shipTypes[i].quantity; j++){
            var ship = new Ship(this.id + '-' + this.ships.length, shipTypes[i].size, shipTypes[i].color);   
            ship.initPlacement(this.ships.length, true, this.cellSizePx, this.fieldRight, this.fieldTop);
            this.ships.push(ship);
        }

    this.showShips = true;
    this.destroyedShips = 0;
    this.winnerBoard = false;
    this.looserBoard = false;
}

Board.prototype = {
/*    shipIsCompletelyOverField: function(ship){
        return ship.x > this.fieldLeft && ship.x < this.fieldRight - ship.w && ship.y > this.fieldTop && ship.y < this.fieldBottom - ship.h;
    },*/
    posIsOverField: function(x, y){
        return x > this.fieldLeft && x < this.fieldRight && y > this.fieldTop && y < this.fieldBottom;
    },
    allShipsPlaced: function(){
        for(var i=0; i < this.ships.length; i++)
            if(this.ships[i].occupyingCells.length == 0)
                return false;
        return true;
    },
    getSelectedShip: function(x, y){
        for(var i=0; i < this.ships.length; i++)
            if(this.ships[i].isOnMe(x,y))
                return this.ships[i];
        return null;
    },
    shipIsMoving: function(ship, xMouse, yMouse){
        ship.moveTo(xMouse, yMouse);
        var relXpos = ship.x - this.fieldLeft;
        var relYpos = ship.y - this.fieldTop;
        var row = Math.round(relYpos / this.cellSizePx);
        var col = Math.round(relXpos / this.cellSizePx);

        if(this.shipIsCompletelyOverField(ship))
            if(this.field.allCellsFree(ship.size, ship.orientation, row, col)){
                var cells = [];
                for(var i=0; i < ship.size; i++)
                    cells.push(this.field.getCellByRowCol(row + (ship.orientation ? 0 : i), col + (ship.orientation ? i : 0)));
                this.field.lastValidShipPositionCells = cells;
            } 

        game.updatedBoard(UpdateReport.SHIPMOVED);  
    },
     shipIsCompletelyOverField: function(ship){
        return ship.x > this.fieldLeft && ship.x < this.fieldRight - ship.w && ship.y > this.fieldTop && ship.y < this.fieldBottom - ship.h;
    },
    placeShip: function(ship){
        this.field.placeShipAtLastValidPosition(ship, this.fieldLeft, this.fieldTop, this.cellSizePx);
        game.updatedBoard(UpdateReport.SHIPWASMANUALLYPLACED);
        console.log(ship);
    },
    placeShipByCoords: function(ship, orientation, row, col){     
        if(ship.orientation != orientation)
            ship.flipOrientation();
        ship.x = this.fieldLeft + col * this.cellSizePx;
        ship.y = this.fieldTop + row * this.cellSizePx;
        ship.occupyingCells = [];
        for(var i=0; i < ship.size; i++){
            var cell = this.field.getCellByRowCol(row + (orientation ? 0 : i), col + (orientation ? i : 0));
            cell.occupiedBy = ship;
            ship.occupyingCells.push(cell); 
        }
    },
    revokeShipPlacement: function(ship){
        if(ship.occupyingCells.length > 0)
            this.field.lastValidShipPositionCells = ship.occupyingCells; // making the previous placement position the lastValidShipPositionCells for the ship to flip back into the field if dragged outside
        for(var i=0; i < ship.occupyingCells.length; i++) // free the cells in case it was already placed before
            ship.occupyingCells[i].occupiedBy = null;
        ship.occupyingCells = [];  
    },
    flipShipsOrientation: function(ship){
        this.field.lastValidShipPositionCells = []; 
        // TODO: a "spiraling outwards" (to find closest valid pos) algorithm instead would be mathematically nicer and computationally less expensive                   
        var prevMiddleX = ship.x + ship.w / 2;
        var prevMiddleY = ship.y + ship.h / 2;
        var validPositions = ship.orientation ? this.getVerticalValidShipPositions(ship) : this.getHorizontalValidShipPositions(ship);
        var minDist = Number.MAX_VALUE;
        var indexOfMinDist = -1;
        for(var i=0; i < validPositions.length; i++){
            var newMiddleX = this.fieldLeft + validPositions[i].col * this.cellSizePx + ship.h / 2;
            var newMiddleY = this.fieldTop + validPositions[i].row * this.cellSizePx + ship.w / 2;
            var dist = Math.sqrt(Math.pow(newMiddleX - prevMiddleX, 2) + Math.pow(newMiddleY - prevMiddleY, 2));
            //console.log('checking valid pos ' + i + ': (' + validPositions[i].row + ',' + validPositions[i].col + ') of ' + validPositions.length + ' has dist: ' + dist);
            if(dist < minDist){
                minDist = dist;
                indexOfMinDist = i;
            }
        }
        ship.flipOrientation();
        this.placeShipByCoords(ship, ship.orientation, validPositions[indexOfMinDist].row, validPositions[indexOfMinDist].col);
        game.updatedBoard(UpdateReport.SHIPFLIPPEDORIENTATION);
    },
    randomlyPlaceShips: function(){    
        this.field.clear();
        for(var i=0; i < this.ships.length; i++){
            var ship = this.ships[i];
            var validPositions = Math.random() < 0.5 ? this.getHorizontalValidShipPositions(ship) : this.getVerticalValidShipPositions(ship);
            var randomIndex = Math.round(Math.random() * (validPositions.length - 1)); //if no valid positions available this goes negative and throws an error
            var randomGridPos = validPositions[randomIndex];
            this.placeShipByCoords(ship, randomGridPos.orientation, randomGridPos.row, randomGridPos.col);
        }
        game.updatedBoard(UpdateReport.SHIPSWERERANDOMLYPLACED);
    },
    getHorizontalValidShipPositions: function(ship){
        var validPositions = [];
        for(var row=0; row < this.cols; row++)
            for(var col=0; col < this.rows - ship.size + 1; col++)
                if(this.field.allCellsFree(ship.size, true, row, col))
                    validPositions.push(new ShipPos(true, row, col));
        return validPositions;
    },
    getVerticalValidShipPositions: function(ship){
        var validPositions = [];
        for(var row=0; row < this.cols - ship.size + 1; row++)
            for(var col=0; col < this.rows; col++)
                if(this.field.allCellsFree(ship.size, false, row, col))
                    validPositions.push(new ShipPos(false, row, col));
        return validPositions;
    },
    clear: function(){
        this.field.clear();
        for(var i=0; i < this.ships.length; i++)
            this.ships[i].occupyingCells = [];
    },
    fire: function(row, col){
        var fireResult = this.field.getCellByRowCol(row, col).fire();
        if(fireResult.status == CellStatus.DESTROYED)
            this.destroyedShips ++;
        if(this.destroyedShips == this.ships.length){
            fireResult.allShipsDestroyed = true;
        }
        return fireResult;
    },
    calculateAllPossibleSetups: function(){

        // TODO

    }
};
