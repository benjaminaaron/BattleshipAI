/**
* Refers to the game board that contains the field holding the specific cells A1, A2, ..., A10, ... J10.
* Also contains ... what?
* Provides methods on ship and cell manipulation.
*/


var Board = function(id, player, shipTypes, rows, cols){
    this.id = id;
    this.player = player;

    this.rows = rows;
    this.cols = cols;

    // field  
    this.field = new Field(rows, cols);

    //add ships as defined in shipTypes
    this.ships = [];
    for(var i=0; i < shipTypes.length; i++)
        for(var j=0; j < shipTypes[i].quantity; j++){
            var ship = new Ship(this.id + '-' + this.ships.length, shipTypes[i].size, shipTypes[i].color, true);   
            this.ships.push(ship);
        }

    this.showShips = true;
    this.destroyedShips = 0;
    this.winnerBoard = false;
    this.looserBoard = false;
}

Board.prototype = {
    allShipsPlaced: function(){
        for(var i=0; i < this.ships.length; i++)
            if(this.ships[i].occupyingCells.length == 0)
                return false;
        return true;
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
    },
    placeShipByCoords: function(ship, orientation, row, col){     
        ship.orientation = orientation;
        ship.occupyingCells = [];
        for(var i=0; i < ship.size; i++){
            var cell = this.field.getCellByRowCol(row + (orientation ? 0 : i), col + (orientation ? i : 0));
            cell.occupiedBy = ship;
            ship.occupyingCells.push(cell); 
        }
    },
    /** Adds waves to a cell. Used to mark cells vertically or horizontally adjacent to a ship. */
    addWavesToFields: function(row, col, orientation) {
        var rowAddition, colAddition
        if(orientation) {         // true = horizontal, false = vertical
            rowAddition = 0;
            colAddition = 1;
        }
        else {
            rowAddition = 1;
            colAddition = 0;
        }
        this.field.getCellByRowCol(row + rowAddition, col + colAddition).status = CellStatus.WAVE;
        var firstAdjacentCell = this.field.getCellByRowCol(row - rowAddition, col - colAddition).status = CellStatus.WAVE;
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
