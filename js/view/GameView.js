
var GameView = function(){
	AbstractView.call(this);
}

GameView.prototype = {
	__proto__: AbstractView.prototype,

	init: function(viewContainer, player0, player1){
		AbstractView.prototype.init.call(this, viewContainer, player0, player1);

        this.viewContainer = viewContainer;
        this.player0 = player0;
        //this.currentPlayer = player0;
        this.player1 = player1;

	 	var canvasWidthPx = 370;
    	var canvasHeightPx = 300;

    	var canvas = $('<canvas>').attr({
	        'id': 'canvas_0',
	        'width': canvasWidthPx,
	        'height': canvasHeightPx
    	});
    	$(viewContainer).append(canvas);
    	this.canvas0 = $(canvas)[0];
    	this.installCanvasListener(this.canvas0, 0);   

	    if(player1){
		    canvas = $('<canvas>').attr({
		        'id': 'canvas_1',
		        'width': canvasWidthPx,
		        'height': canvasHeightPx
	    	});
	    	$(viewContainer).append(canvas);
	    	this.canvas1 = $(canvas)[0];
	    	this.installCanvasListener(this.canvas1, 1);   
   	 	}

	},
	installCanvasListener: function(canvas, id){
        var self = this;
        $(canvas).on('mousedown touchstart', function(e) {
            e.preventDefault();
            var canvasElement = this.getBoundingClientRect();
            var xMouse = e.originalEvent.pageX - canvasElement.left;
            var yMouse = e.originalEvent.pageY - canvasElement.top;
            game.handleCanvasEvent(0, id, xMouse, yMouse);
        });
        $(canvas).on('mousemove touchmove', function(e) {
            e.preventDefault();
            var canvasElement = this.getBoundingClientRect();
            var xMouse = e.originalEvent.pageX - canvasElement.left;
            var yMouse = e.originalEvent.pageY - canvasElement.top;
            game.handleCanvasEvent(1, id, xMouse, yMouse);        
        });
        $(canvas).on('mouseup touchend', function(e) {
            e.preventDefault();
            var canvasElement = this.getBoundingClientRect();
            var xMouse = e.originalEvent.pageX - canvasElement.left;
            var yMouse = e.originalEvent.pageY - canvasElement.top;
            game.handleCanvasEvent(2, id, xMouse, yMouse);        
        });
    },
    draw: function(){ // TODO only redraw changed board
        this.drawBoard(this.canvas0.getContext('2d'), this.player0.board, this.player0.myTurn);
        if(this.player1)
            this.drawBoard(this.canvas1.getContext('2d'), this.player1.board, this.player1.myTurn);
    },
    drawBoard: function(ctx, board, isActiveBoard){
        var width = ctx.canvas.width;
        var height = ctx.canvas.height;
        ctx.clearRect(0, 0, width, height); 
		
		// marking active board with frame around it
		if(isActiveBoard){
			ctx.lineWidth = '12';
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
        this.drawShadowShip(ctx, board);

        // ships
        if(board.showShips)
            this.drawShips(ctx, board.ships);
                 
        // hits
        this.drawHits(ctx, board);

        // destroyed ships
        this.drawDestroyedShips(ctx, board.ships);

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
        ctx.fillText(name, board.fieldLeft, board.fieldTop - 30);
        ctx.fillStyle = 'maroon';
        ctx.font = '10px georgia'; 
        ctx.fillText(board.player.type, board.fieldLeft + nameWidth + 10, board.fieldTop - 30);
    },
    drawField: function(ctx, board){
        var field = board.field;
        var fieldLeft = board.fieldLeft;
        var fieldTop = board.fieldTop;
        var cellSizePx = board.cellSizePx;

        //border around field
        ctx.strokeStyle = 'gray';  
        ctx.lineWidth = 2;
        ctx.rect(fieldLeft, fieldTop, board.cols * cellSizePx, board.rows * cellSizePx);
        ctx.stroke();

        // grid & labels
        ctx.strokeStyle = 'silver'; 
        ctx.lineWidth = 1;
        ctx.fillStyle = 'gray';
        ctx.font = '12px arial';           
        for(var i=0; i <= board.rows; i++){
            var yPos = fieldTop + i * cellSizePx;
            ctx.beginPath();
            ctx.moveTo(fieldLeft, yPos);
            ctx.lineTo(fieldLeft + board.cols * cellSizePx, yPos);
            ctx.stroke();
            if(i < this.rows)
                ctx.fillText((i + 1), fieldLeft + ((i + 1) < 10 ? -16 : -20), yPos + 14);
        }
        for(var i=0; i <= board.cols; i++){
            var xPos = fieldLeft + i * cellSizePx;
            ctx.beginPath();
            ctx.moveTo(xPos, fieldTop);
            ctx.lineTo(xPos, fieldTop + board.rows * cellSizePx);
            ctx.stroke();
            if(i < board.cols)
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
    drawShips: function(ctx, ships){
        for(var i=0; i < ships.length; i++){
            var ship = ships[i];
            ctx.fillStyle = ship.color;   
            ctx.fillRect(ship.x, ship.y, ship.w, ship.h);
        }
    }, 
    drawShadowShip: function(ctx, board){
    	var cellcluster = board.field.lastValidShipPositionCells;
    	if(cellcluster.length > 0){
	    	var cellSizePx = board.cellSizePx;
	    	var fieldLeft = board.fieldLeft;
	    	var fieldTop = board.fieldTop;

	    	var head = cellcluster[0];
	    	var headX = fieldLeft + head.col * cellSizePx;
	        var headY = fieldTop + head.row * cellSizePx;

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
        var fieldLeft = board.fieldLeft;
        var fieldTop = board.fieldTop;
        var cellSizePx = board.cellSizePx;
        var a = cellSizePx / 2 - 4;
        ctx.strokeStyle = 'black'; 
        ctx.fillStyle = 'black';
        ctx.lineWidth = 2;

        for(var i=0; i < field.cells.length; i++){
            var cell = field.cells[i];
            var xMiddle = fieldLeft + cell.col * cellSizePx + cellSizePx / 2;
            var yMiddle = fieldTop + cell.row * cellSizePx + cellSizePx / 2;
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
    drawDestroyedShips: function(ctx, ships){
        ctx.strokeStyle = 'black'; 
        ctx.lineWidth = 2;
        for(var i=0; i < ships.length; i++){
            var ship = ships[i];
            if(ship.destroyed){
                ctx.rect(ship.x, ship.y, ship.w, ship.h);
                ctx.stroke();
            }
        }
    }
}
