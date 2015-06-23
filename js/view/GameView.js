/**
 * Handles drawing/displaying the GUI for gameplay.
 * @param viewContainer DOM element - simple <div>
 * @constructor
 */
var GameView = function(viewContainer){
	this.viewContainer = viewContainer;
    this.player0 = game.player0;
    this.player1 = game.player1;

    this.rows = 10;
    this.cols = 10;

    // initialize field
    this.cellSizePx = 20;
    this.fieldLeft = 30;
    this.fieldTop = 60;
    this.fieldRight = this.fieldLeft + this.rows * this.cellSizePx;
    this.fieldBottom = this.fieldTop + this.cols * this.cellSizePx; 

    this.shipsWrapped = [];

    this.lastValidShipPositionCellsOwner = null;
    this.lastValidShipPositionCells = [];
}

GameView.prototype = {

	init: function(viewContainer){

        var canvasWidthPx = 370;
        var canvasHeightPx = 300;

        // canvas for drawing player's own gamefield
        this.canvas0 = this.initializeCanvas(0, canvasWidthPx, canvasHeightPx);
        this.installCanvasListener(this.canvas0, 0);

        // canvas for drawing the opponent's gamefield
        this.canvas1 = this.initializeCanvas(1, canvasWidthPx, canvasHeightPx);
        this.installCanvasListener(this.canvas1, 1);

        this.wrapAndInitShips(this.player0);
        this.wrapAndInitShips(this.player1);

        this.handleUpdatedBoard(UpdateReport.INIT);
	},

    /**
     * Draws the canvas required for a gamefield. The game needs to separate gamefields.
     * @param canvasID  0, if canvas belongs to player's own gamefield.
     *                  1, if canvas represents opponent's gamefield.
     * @param canvasWidthPx The required width of the canvas.
     * @param canvasHeightPx The required height of the canvas.
     * @returns The pure canvas element. If we returned the canvas obj itself, we would get a lot of jQuery BS.
     */
    initializeCanvas: function(canvasID, canvasWidthPx, canvasHeightPx){

        var canvas = $('<canvas>').attr({
            'id': 'canvas_' + canvasID,
            'width': canvasWidthPx,
            'height': canvasHeightPx
        });

        $(viewContainer).append(canvas);

        // strip the canvas obj of its jQuery wrapper stuff
        return $(canvas)[0];
    },

    /**
     *
     * @param player
     */
    wrapAndInitShips: function(player){

        var ships = player.board.ships;

        for(var shipNo = 0; shipNo < ships.length; shipNo++){
            var shipWrapper = new ShipWrapper(player, ships[shipNo], shipNo, this.cellSizePx, this.fieldLeft, this.fieldRight, this.fieldTop);
            this.shipsWrapped.push(shipWrapper);
        }
    },
    
    getSelectedShip: function(callerID, x, y){
        for(var i=0; i < this.shipsWrapped.length; i++){
            var shipWr = this.shipsWrapped[i];
            if(shipWr.player.ID == callerID && shipWr.isOnMe(x,y))
                return shipWr;
        }
        return null;
    },
    revokeShipPlacement: function(shipWr){
        var ship = shipWr.ship;
        if(ship.occupyingCells.length > 0){
            this.lastValidShipPositionCells = ship.occupyingCells; // making the previous placement position the lastValidShipPositionCells for the ship to flip back into the field if dragged outside
            this.lastValidShipPositionCellsOwner = shipWr.player;
        }
        for(var i=0; i < ship.occupyingCells.length; i++) // free the cells in case it was already placed before
            ship.occupyingCells[i].occupiedBy = null;
        ship.occupyingCells = [];  
    },
    shipIsCompletelyOverField: function(shipWr){
        return shipWr.x > this.fieldLeft && shipWr.x < this.fieldRight - shipWr.w && shipWr.y > this.fieldTop && shipWr.y < this.fieldBottom - shipWr.h;
    },
    shipIsMoving: function(shipWr, xMouse, yMouse){
        shipWr.moveTo(xMouse, yMouse);
        
        var relXpos = shipWr.x - this.fieldLeft;
        var relYpos = shipWr.y - this.fieldTop;
        var row = Math.round(relYpos / this.cellSizePx);
        var col = Math.round(relXpos / this.cellSizePx);

        if(this.shipIsCompletelyOverField(shipWr)){
            var field = shipWr.player.board.field;
            var ship = shipWr.ship;
            if(field.allCellsFree(ship.size, ship.orientation, row, col)){
                var cells = [];
                for(var i=0; i < ship.size; i++)
                    cells.push(field.getCellByRowCol(row + (ship.orientation ? 0 : i), col + (ship.orientation ? i : 0)));
                this.lastValidShipPositionCells = cells;
                this.lastValidShipPositionCellsOwner = shipWr.player;
            } 
        }
        this.handleUpdatedBoard(UpdateReport.SHIPMOVED);  
    },
    flipShipsOrientation: function(shipWr){
        var ship = shipWr.ship;
        var board = shipWr.player.board;
        this.lastValidShipPositionCells = []; 
        this.lastValidShipPositionCellsOwner = null;
        // TODO: a "spiraling outwards" (to find closest valid pos) algorithm instead would be mathematically nicer and computationally less expensive                   
        var prevMiddleX = shipWr.x + shipWr.w / 2;
        var prevMiddleY = shipWr.y + shipWr.h / 2;
        var validPositions = ship.orientation ? board.getVerticalValidShipPositions(ship) : board.getHorizontalValidShipPositions(ship);
        var minDist = Number.MAX_VALUE;
        var indexOfMinDist = -1;
        for(var i=0; i < validPositions.length; i++){
            var newMiddleX = this.fieldLeft + validPositions[i].col * this.cellSizePx + shipWr.h / 2;
            var newMiddleY = this.fieldTop + validPositions[i].row * this.cellSizePx + shipWr.w / 2;
            var dist = Math.sqrt(Math.pow(newMiddleX - prevMiddleX, 2) + Math.pow(newMiddleY - prevMiddleY, 2));
            //console.log('checking valid pos ' + i + ': (' + validPositions[i].row + ',' + validPositions[i].col + ') of ' + validPositions.length + ' has dist: ' + dist);
            if(dist < minDist){
                minDist = dist;
                indexOfMinDist = i;
            }
        }
        shipWr.flipOrientation();
        shipWr.player.board.placeShipByCoords(shipWr.ship, ship.orientation, validPositions[indexOfMinDist].row, validPositions[indexOfMinDist].col);
        shipWr.update();
        this.handleUpdatedBoard(UpdateReport.SHIPFLIPPEDORIENTATION);
    },
    posIsOverField: function(x, y){
        return x > this.fieldLeft && x < this.fieldRight && y > this.fieldTop && y < this.fieldBottom;
    },
    placeShip: function(shipWr){
        shipWr.movingStopped();
        this.placeShipAtLastValidPosition(shipWr);
        this.handleUpdatedBoard(UpdateReport.SHIPWASMANUALLYPLACED);
    },
    placeShipAtLastValidPosition: function(shipWr){
        var ship = shipWr.ship;
        var cells = this.lastValidShipPositionCells;
        if(cells.length > 0){
            for(var i=0; i < cells.length; i++)          
                cells[i].occupiedBy = ship;

            ship.occupyingCells = cells;    
            this.lastValidShipPositionCells = []; 
            this.lastValidShipPositionCellsOwner = null;

            var headCell = cells[0];
            shipWr.x = this.fieldLeft + headCell.col * this.cellSizePx;
            shipWr.y = this.fieldTop + headCell.row * this.cellSizePx;
        }
    },
    updateWrappedShips: function(playerID){ //beacuse orientation might have changed during random setup     
        for(var i=0; i < this.shipsWrapped.length; i++)
            if(this.shipsWrapped[i].player.ID == playerID)
                this.shipsWrapped[i].update();
    },
    getCellRCbyCoords: function(xMouse, yMouse){
        var relXpos = xMouse - this.fieldLeft;
        var relYpos = yMouse - this.fieldTop;
        var row = Math.abs(Math.round((relYpos - this.cellSizePx / 2) / this.cellSizePx));
        var col = Math.abs(Math.round((relXpos - this.cellSizePx / 2) / this.cellSizePx));     
        return new AbstractCell(row, col);
    },
	installCanvasListener: function(canvas, id){
        var self = this;
        $(canvas).on('mousedown touchstart', function(e) {
            e.preventDefault();
            var canvasElement = this.getBoundingClientRect();
            var xMouse = e.originalEvent.pageX - canvasElement.left;
            var yMouse = e.originalEvent.pageY - canvasElement.top;
            game.handleCanvasEvent(MouseEvent.MOUSEDOWN, id, xMouse, yMouse);
        });
        $(canvas).on('mousemove touchmove', function(e) {
            e.preventDefault();
            var canvasElement = this.getBoundingClientRect();
            var xMouse = e.originalEvent.pageX - canvasElement.left;
            var yMouse = e.originalEvent.pageY - canvasElement.top;
            game.handleCanvasEvent(MouseEvent.MOUSEMOVE, id, xMouse, yMouse);        
        });
        $(canvas).on('mouseup touchend', function(e) {
            e.preventDefault();
            var canvasElement = this.getBoundingClientRect();
            var xMouse = e.originalEvent.pageX - canvasElement.left;
            var yMouse = e.originalEvent.pageY - canvasElement.top;
            game.handleCanvasEvent(MouseEvent.MOUSEUP, id, xMouse, yMouse);        
        });
    },
    /*handleCanvasEvent: function(type, ID, xMouse, yMouse){
        var player = game.currentPlayer;
        var eventOriginBoardOwner = ID == 0 ? this.player0 : this.player1;

        var sendCanvasEventToPlayer;
        if(!this.inPlayPhase) // manages the control-switch btwn. setup- and play-phase
            sendCanvasEventToPlayer = player == eventOriginBoardOwner;
        else
            sendCanvasEventToPlayer = player != eventOriginBoardOwner;

        if(sendCanvasEventToPlayer)
            player.controller.handleMouseEvent(type, xMouse, yMouse);
    },*/
    handleUpdatedBoard: function(updateReport, currentPlayerID){ // TODO only redraw changed board
        // TODO do something with updateReport

        if(updateReport == UpdateReport.SHIPSWERERANDOMLYPLACED)
            this.updateWrappedShips(currentPlayerID);

        this.drawBoard(this.canvas0.getContext('2d'), this.player0);
        this.drawBoard(this.canvas1.getContext('2d'), this.player1);
    },
    drawBoard: function(ctx, player){
        var width = ctx.canvas.width;
        var height = ctx.canvas.height;
        ctx.clearRect(0, 0, width, height);
        var isActiveBoard = player.myTurn; 
        var board = player.board;
		
		// marking active board with frame around it
		if(isActiveBoard){
			ctx.lineWidth = '10';
			ctx.strokeStyle = 'orange';
		} else {
			ctx.lineWidth = '6';
			ctx.strokeStyle = 'silver';
		}
		ctx.beginPath();
		ctx.rect(0, 0, width, height);
		ctx.stroke();

        // winner board effect
        if(board.winnerBoard){
            ctx.fillStyle = 'yellow';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.width);
        }

        // field
        this.drawField(ctx, board);

        //ship (=cellcluster) while dragging, if there is one
        if(this.lastValidShipPositionCellsOwner != null)
            if(player.ID == this.lastValidShipPositionCellsOwner.ID)
                this.drawShadowShip(ctx);

        // ships
        if(board.showShips)
            this.drawShips(ctx, player.ID);
                         
        // hits
        this.drawHits(ctx, board);

        // destroyed ships
        this.drawDestroyedShips(ctx, player.ID);

        // loser board effect
        if(board.looserBoard){
            ctx.strokeStyle = 'red'; 
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, ctx.canvas.height);
            ctx.lineTo(ctx.canvas.width, 0);
            ctx.stroke();
        }

        // name
        ctx.fillStyle = 'navy';
        ctx.font = '20px georgia'; 
        var name = board.player.name;
        var nameWidth = ctx.measureText(name).width;
        ctx.fillText(name, this.fieldLeft, this.fieldTop - 30);
        ctx.fillStyle = 'maroon';
        ctx.font = '10px georgia'; 
        ctx.fillText(board.player.type, this.fieldLeft + nameWidth + 10, this.fieldTop - 30);
    },
    drawField: function(ctx, board){
        var field = board.field;
        var fieldLeft = this.fieldLeft;
        var fieldTop = this.fieldTop;
        var cellSizePx = this.cellSizePx;
        var rows = this.rows;
        var cols = this.cols;

        //border around field
        ctx.strokeStyle = 'gray';  
        ctx.lineWidth = 2;
        ctx.rect(fieldLeft, fieldTop, cols * cellSizePx, rows * cellSizePx);
        ctx.stroke();

        // grid & labels
        ctx.strokeStyle = 'silver'; 
        ctx.lineWidth = 1;
        ctx.fillStyle = 'gray';
        ctx.font = '12px arial';           
        for(var i=0; i <= rows; i++){
            var yPos = fieldTop + i * cellSizePx;
            ctx.beginPath();
            ctx.moveTo(fieldLeft, yPos);
            ctx.lineTo(fieldLeft + cols * cellSizePx, yPos);
            ctx.stroke();
            if(i < rows)
                ctx.fillText((i + 1), fieldLeft + ((i + 1) < 10 ? -16 : -20), yPos + 14);
        }
        for(var i=0; i <= cols; i++){
            var xPos = fieldLeft + i * cellSizePx;
            ctx.beginPath();
            ctx.moveTo(xPos, fieldTop);
            ctx.lineTo(xPos, fieldTop + rows * cellSizePx);
            ctx.stroke();
            if(i < cols)
                ctx.fillText(String.fromCharCode('A'.charCodeAt() + i), xPos + 6, fieldTop - 8);     
        }

        // cell coloring for hovered cells
        for(var i=0; i < field.cells.length; i++){
            var cell = field.cells[i];
            if(cell.hoveredBy){
                ctx.fillStyle = 'silver';    
                ctx.fillRect(fieldLeft + cell.col * cellSizePx, fieldTop + cell.row * cellSizePx, cellSizePx, cellSizePx);
            }
        }

    },
    drawShips: function(ctx, playerID){
        for(var i=0; i < this.shipsWrapped.length; i++){
            var shipWr = this.shipsWrapped[i];
            if(shipWr.player.ID == playerID){
                ctx.fillStyle = shipWr.ship.color;   
                ctx.fillRect(shipWr.x, shipWr.y, shipWr.w, shipWr.h);                
            }
        }
    }, 
    drawShadowShip: function(ctx){
    	var cellcluster = this.lastValidShipPositionCells;
    	if(cellcluster.length > 0){
	    	var cellSizePx = this.cellSizePx;

	    	var head = cellcluster[0];
	    	var headX = this.fieldLeft + head.col * cellSizePx;
	        var headY = this.fieldTop + head.row * cellSizePx;

            var orientation = true;
            if(cellcluster.length > 1)
	           var orientation = head.row == cellcluster[1].row; 
	        var size = cellcluster.length;
	        var w = orientation ? size * cellSizePx : cellSizePx;
	        var h = orientation ? cellSizePx : size * cellSizePx;

	       	ctx.fillStyle = 'silver';   
            ctx.fillRect(headX, headY, w, h);
    	}
    },
    drawHits: function(ctx, board){
        var field = board.field;
        var cellSizePx = this.cellSizePx;
        var a = cellSizePx / 2 - 4;
        ctx.strokeStyle = 'black'; 
        ctx.fillStyle = 'black';
        ctx.lineWidth = 2;

        for(var i=0; i < field.cells.length; i++){
            var cell = field.cells[i];
            var xMiddle = this.fieldLeft + cell.col * cellSizePx + cellSizePx / 2;
            var yMiddle = this.fieldTop + cell.row * cellSizePx + cellSizePx / 2;
            if(cell.fired)
                if(cell.occupiedBy == null){
                    ctx.beginPath();
                    ctx.arc(xMiddle, yMiddle, a / 2, 0, Math.PI*2); 
                    ctx.closePath();
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.moveTo(xMiddle - a, yMiddle - a);
                    ctx.lineTo(xMiddle + a, yMiddle + a);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(xMiddle - a, yMiddle + a);
                    ctx.lineTo(xMiddle + a, yMiddle - a);
                    ctx.stroke();
                }
        }
    },
    drawDestroyedShips: function(ctx, playerID){
        ctx.strokeStyle = 'black'; 
        ctx.lineWidth = 2;
        for(var i=0; i < this.shipsWrapped.length; i++){
            var shipWr = this.shipsWrapped[i];
            if(shipWr.player.ID == playerID && shipWr.ship.destroyed){
                ctx.rect(shipWr.x, shipWr.y, shipWr.w, shipWr.h);
                ctx.stroke();
            }
        }
    }
    // TODO: drawWaves, drawMines, drawRadiation
    // TODO: Placement for Mines like Ships
}
