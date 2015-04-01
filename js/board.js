
var Board = function(id, container, btnCallback, player, shipTypes, rows, cols){
    this.id = id;
    this.player = player;

    this.canvasWidthPx = 370;
    this.canvasHeightPx = 300;

    var canvas = $(this.buildDOM(container, player))[0];
    player.init(this, canvas);

    this.ctx = canvas.getContext('2d');
    this.drawMe = false;
    this.oneMoreDraw = false;

    this.rows = rows;
    this.cols = cols;

    // field
    this.cellSizePx = 20;
    this.fieldLeft = 30;
    this.fieldTop = 60;
    this.fieldRight = this.fieldLeft + rows * this.cellSizePx;
    this.fieldBottom = this.fieldTop + cols * this.cellSizePx;    
    this.field = new Field(rows, cols, this.ctx, this.fieldLeft, this.fieldTop, this.cellSizePx);

    // rotation switch
    this.rotSwitchX = this.fieldRight + 30; 
    this.rotSwitchY = this.fieldTop - 40;
    this.rotSwitchSize = 30;

    //add ships as defined in shipTypes
    this.ships = [];
    for(var i=0; i < shipTypes.length; i++)
    	for(var j=0; j < shipTypes[i].quantity; j++){
            var ship = new Ship(this.id + '-' + this.ships.length, shipTypes[i].size, shipTypes[i].color, this.cellSizePx, this.fieldRight, this.fieldTop);   
            ship.initPlacement(this.ships.length, true);
    		this.ships.push(ship);
        }

    this.selectedShip = null;
}

Board.prototype = {
    draw: function(){
            var ctx = this.ctx;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 

            // name
            ctx.fillStyle = 'navy';
            ctx.font = '20px georgia'; 
            var name = this.player.name;
            var nameWidth = ctx.measureText(name).width;
            ctx.fillText(name, this.fieldLeft, this.fieldTop - 30);
            ctx.fillStyle = 'maroon';
            ctx.font = '10px georgia'; 
            ctx.fillText(this.player.type, this.fieldLeft + nameWidth + 10, this.fieldTop - 30);

            // field
            this.field.draw();

            // ships
            for(var i=0; i < this.ships.length; i++)
                this.ships[i].draw(ctx);

            // hits
            this.field.drawHits();

            //rotation switch
            ctx.fillStyle = '#DDD';    
            ctx.fillRect(this.rotSwitchX, this.rotSwitchY, this.rotSwitchSize, this.rotSwitchSize); 
            ctx.fillStyle = 'gray';
            ctx.font = '14px georgia';       
            ctx.fillText('R', this.rotSwitchX + 10, this.rotSwitchY + 20);
    },
    buildDOM: function(container, player){     
        var canvas = $('<canvas>').attr({
            'id': 'canvas_' + this.id,
            'width': this.canvasWidthPx,
            'height': this.canvasHeightPx
        });
        $(container).append(canvas);

        if(player.type == 'human'){
            var btnList = $('<ul>').attr({
                'class': 'btnList'
            });
            $(container).append(btnList);
            
            var listElement = $('<li>');
            $(btnList).append(listElement);
            var doneBtn = $('<input>').attr({
                'id': 'doneBtn_' + this.id,
                'type': 'button',
                'value': 'done',
                'disabled': true
            });
            $(doneBtn).click(function(){
                player.btnCallback('done');
            });  
            $(listElement).append(doneBtn);

            listElement = $('<li>');
            $(btnList).append(listElement);
            var randomBtn = $('<input>').attr({
                'id': 'randomBtn_' + this.id,
                'type': 'button',
                'value': 'random',
                'disabled': true
            });
            $(randomBtn).click(function(){
                player.btnCallback('random');
            }); 
            $(listElement).append(randomBtn);
        }

        return canvas;
    },
    shipIsCompletelyOverField: function(ship){
        return ship.x > this.fieldLeft && ship.x < this.fieldRight - ship.w && ship.y > this.fieldTop && ship.y < this.fieldBottom - ship.h;
    },
    shipTouchesRotationSwitch: function(ship){
        return ship.y < this.rotSwitchY + this.rotSwitchSize && ship.y + ship.h > this.rotSwitchY && ship.x < this.rotSwitchX + this.rotSwitchSize && ship.x + ship.w > this.rotSwitchX;
    },
    getSelectedShip: function(x, y){
        for(var i=0; i < this.ships.length; i++)
            if(this.ships[i].isOnMe(x,y))
                return this.ships[i];
        return null;
    },
    handleShipMovesOverField: function(ship){
        var relXpos = ship.x - this.fieldLeft;
        var relYpos = ship.y - this.fieldTop;
        var row = Math.round(relYpos / this.cellSizePx);
        var col = Math.round(relXpos / this.cellSizePx);

        if(this.field.allCellsFree(ship.size, ship.orientation, row, col)){
            var cells = [];
            for(var i=0; i < ship.size; i++)
                cells.push(this.field.getCellByRowCol(row + (ship.orientation ? 0 : i), col + (ship.orientation ? i : 0)));
            this.field.updateShadowCells(cells, ship);
        }
    },
    placeShip: function(){
        // the field part
        var headCell = this.field.placeLastShadowShipCells();
        // the ship part
        if(headCell){
            var ship = headCell.occupiedBy;
            if(ship.orientation != headCell.orientationWhileHovering)
                ship.flipOrientation();
            ship.x = this.fieldLeft + headCell.col * this.cellSizePx;
            ship.y = this.fieldTop + headCell.row * this.cellSizePx;
        }
    },
    placeShipByCoords: function(ship, orientation, row, col){     
        if(ship.orientation != orientation)
            ship.flipOrientation();
        ship.x = this.fieldLeft + col * this.cellSizePx;
        ship.y = this.fieldTop + row * this.cellSizePx;
        for(var i=0; i < ship.size; i++){
            var cell = this.field.getCellByRowCol(row + (orientation ? 0 : i), col + (orientation ? i : 0));
            cell.occupiedBy = ship;
            ship.occupyingCells.push(cell); 

            //TODO move to field?
            this.field.neighbourBlast(cell, 1);
        }
        this.oneMoreDraw = true; 
        initDraw();
    },
    randomlyPlaceShips: function(){    
        this.clearField();
        for(var i=0; i < this.ships.length; i++){
            var ship = this.ships[i];
            var validPositions = [];
            // add horizontal valid positions
            for(var row=0; row < this.cols; row++)
                for(var col=0; col < this.rows - ship.size + 1; col++)
                    if(this.field.allCellsFree(ship.size, true, row, col))
                        validPositions.push(new GridPos(true, row, col));
            // add vertical valid positions
            for(var row=0; row < this.cols - ship.size + 1; row++)
                for(var col=0; col < this.rows; col++)
                    if(this.field.allCellsFree(ship.size, false, row, col))
                        validPositions.push(new GridPos(false, row, col));

            var randomIndex = Math.round(Math.random() * (validPositions.length - 1)); //if no valid positions available this goes negative and throws an error
            var randomGridPos = validPositions[randomIndex];
            this.placeShipByCoords(ship, randomGridPos.orientation, randomGridPos.row, randomGridPos.col);
        }
    },
    clearField: function(){ // TODO move to field?
        for(var i=0; i < this.field.cells.length; i++){
            var cell = this.field.cells[i];
            cell.occupiedBy = null;
            cell.shipsInMyNeighbourhood = 0;
        }
        for(var i=0; i < this.ships.length; i++)
            this.ships[i].occupyingCells = []; 
    },
    allShipsPlaced: function(){
        for(var i=0; i < this.ships.length; i++)
            if(this.ships[i].occupyingCells.length == 0)
                return false;
        return true;
    },
    fire: function(mouseX, mouseY){
        var relXpos = mouseX - this.fieldLeft;
        var relYpos = mouseY - this.fieldTop;
        var row = Math.abs(Math.round((relYpos - this.cellSizePx / 2) / this.cellSizePx));
        var col = Math.abs(Math.round((relXpos - this.cellSizePx / 2) / this.cellSizePx));

        var fireResult = this.field.getCellByRowCol(row, col).fire();

        this.oneMoreDraw = true; 
        initDraw();

        return fireResult;
    }
};
