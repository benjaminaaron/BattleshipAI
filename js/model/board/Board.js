/**
* Refers to the game board that contains the field holding the specific cells A1, A2, ..., A10, ... J10.
* Also contains the ships - those are not elements of the field, especially not in setup phase where they hover next to the field!)
* Provides methods on ship manipulation.
*/


var Board = function(id, player, shipTypes, rows, cols){
    this.id = id;
    this.player = player;

    this.rows = rows;
    this.cols = cols;

    // field
    this.field = new Field(rows, cols);

    //add elements as defined in shipTypes
    this.elements = []; // ships + mines
    this.ships = [];

    for(var shipType = 0; shipType < shipTypes.length; shipType++)
        for(var ship = 0; ship < shipTypes[shipType].quantity; ship++){

            var element;
            if(shipTypes[shipType].size > 1) {
                element = new Ship(this.id + '-' + this.elements.length, shipTypes[shipType].size, shipTypes[shipType].color, true);
                this.ships.push(element);
            }
            else
                element = new Mine(this.id + '-mine', shipTypes[shipType].color);

            this.elements.push(element);
        }

    this.showShips = true;
    this.destroyedShips = 0;
    this.winnerBoard = false;
    this.loserBoard = false;
}

Board.prototype = {

    /**
     * Checks if there are any unplaced mines or elements left.
     * @returns {boolean} True, if every mine and ship is placed - otherwise false.
     */
    allElementsPlaced: function(){
        for(var elementIndex = 0; elementIndex < this.elements.length; elementIndex++)
            if(this.elements[elementIndex].occupyingCells.length == 0)
                return false;
        return true;
    },

    randomlyPlaceShips: function(){
        this.field.clear();
        for(var elementIndex=0; elementIndex < this.elements.length; elementIndex++){
            var element = this.elements[elementIndex];
            var validPositions = Math.random() < 0.5 ? this.getHorizontalValidElementPositions(element) : this.getVerticalValidElementPositions(element);
            var randomIndex = Math.round(Math.random() * (validPositions.length - 1)); //if no valid positions available this goes negative and throws an error
            var randomGridPos = validPositions[randomIndex];
            this.placeElementByCoords(element, randomGridPos.orientation, randomGridPos.row, randomGridPos.col);
        }
    },

    /**
     * Gets called from ...? or randomlyPlaceShips().
     * @param element: ship or mine
     * @param orientation: true = horizontal, false = vertical
     * @param row
     * @param col
     */
    placeElementByCoords: function(element, orientation, row, col){
        element.orientation = orientation;
        element.occupyingCells = [];
        for(var elementPart=0; elementPart < element.size; elementPart++){
            var currentRow = row + (orientation ? 0 : elementPart);
            var currentCol = col + (orientation ? elementPart : 0);
            var cell = this.field.getCellByRowCol(currentRow, currentCol);
            cell.occupiedBy = element;
            element.occupyingCells.push(cell);
        }
    },

    getHorizontalValidElementPositions: function(ship){
        var validPositions = [];
        for(var row=0; row < this.cols; row++)
            for(var col=0; col < this.rows - ship.size + 1; col++)
                if(this.field.allCellsFree(ship.size, true, row, col))
                    validPositions.push(new ShipPos(true, row, col));
        return validPositions;
    },

    getVerticalValidElementPositions: function(ship){
        var validPositions = [];
        for(var row=0; row < this.cols - ship.size + 1; row++)
            for(var col=0; col < this.rows; col++)
                if(this.field.allCellsFree(ship.size, false, row, col))
                    validPositions.push(new ShipPos(false, row, col));
        return validPositions;
    },

    clear: function(){
        this.field.clear();
        for(var i=0; i < this.elements.length; i++)
            this.elements[i].occupyingCells = [];
    },

    /**
     * Places a shot on the game board. Called from Game.js.
     * @param row
     * @param col
     * @returns {*}
     */
    fire: function(row, col){
        var fireResult = this.field.getCellByRowCol(row, col).fire();

        if(fireResult.status == CellStatus.DESTROYED)
            this.destroyedShips++;
        if(this.destroyedShips == this.elements.length)
            fireResult.allShipsDestroyed = true;

        return fireResult;
    },

    /**
     * Checks if all ships on this board have been destroyed.
     * @returns {boolean} True, if every ship has been sunk - false otherwise.
     */
    areAllShipsDestroyed: function() {
        var result = true;
        for(var shipNo = 0; shipNo < this.ships.length; shipNo++) {
            var currentShip = this.ships[shipNo];
            result &= currentShip.isDestroyed();
        }
        return result;
    }
};
