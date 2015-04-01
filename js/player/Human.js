
var Human = function(name){
	AbstractPlayer.call(this);
	this.name = name;
	this.type = 'human';

	this.selectedShip = null;
}

Human.prototype = { 
	__proto__: AbstractPlayer.prototype,

	init: function(board, canvas){
		this.board = board;
		this.canvas = canvas;

		var self = this;

		$(canvas).on('mousedown touchstart', function(e) {
        if(self.myTurn){
            e.preventDefault();
            var canvasElement = canvas.getBoundingClientRect(); // rect.top, rect.right, rect.bottom, rect.left
            var xMouse = e.originalEvent.pageX - canvasElement.left;
            var yMouse = e.originalEvent.pageY - canvasElement.top;
			if(!self.inPlayPhase)
            	self.mousedown(xMouse, yMouse);
            else
            	self.fire(xMouse, yMouse);
        }
	    });
	    $(canvas).on('mousemove touchmove', function(e) {
	        if(self.myTurn && !self.inPlayPhase){ 
	            e.preventDefault();
	            var canvasElement = canvas.getBoundingClientRect();
	            var xMouse = e.originalEvent.pageX - canvasElement.left;
	            var yMouse = e.originalEvent.pageY - canvasElement.top;
	            self.mousemove(xMouse, yMouse);
	        }
	    });
	    $(canvas).on('mouseup touchend', function(e) {
	        if(self.myTurn && !self.inPlayPhase){
	            e.preventDefault();
	           	self.mouseup();
	        }
	    });
	},
	btnCallback: function(btnType){
        var myBoard = game.activeBoard;
        if(btnType == 'done'){ 
           if(myBoard.allShipsPlaced())
                game.nextPlayersTurn();
            else
                alert('not all ships are placed yet');
        }
        if(btnType == 'random')
        	myBoard.randomlyPlaceShips();   
    },
 	mousedown: function(xMouse, yMouse){
 		var board = this.board;
        var ship = board.getSelectedShip(xMouse, yMouse); 

        if(ship){
        	// act on possible previous placement
            for(var i=0; i < ship.occupyingCells.length; i++){ // free the cells in case it was already placed before
                var cell = ship.occupyingCells[i];
                cell.occupiedBy = null;
                board.field.neighbourBlast(cell, -1);
            }

            // act on possible previous floating ("shadow ship")
            board.field.updateShadowCells(ship.occupyingCells, ship); // leaves a shadow-footprint from the last position, in that way it's not possible for ships that were dragged again from the field-border to loose their last position
            
            ship.occupyingCells = [];  
            board.drawMe = true; // causes continuous drawing until this is false again
			this.selectedShip = ship;
            initDraw();      
        }
    },
    mousemove: function(xMouse, yMouse){
    	var board = this.board;
        // because drawMe is true, animation will render continously
        if(this.selectedShip){
            var ship = this.selectedShip;
            ship.moveTo(xMouse, yMouse);

            if(board.shipIsCompletelyOverField(ship)){
            	board.handleShipMovesOverField(ship);  
            	ship.nextFlipAllowed = true;
            }
           	if(board.shipTouchesRotationSwitch(ship))
           		this.flipShipsOrientation(true);		
        }  
    },
    mouseup: function(){
        if(this.selectedShip){
            this.selectedShip.movingStopped();
            this.board.placeShip();
            this.selectedShip = null; 
            this.board.drawMe = false;
            this.board.oneMoreDraw = true;
        }  
    },
    flipShipsOrientation: function(justOnce){
    	var ship = this.selectedShip;
    	if(ship)
	    	if(ship.nextFlipAllowed || !justOnce){
	            ship.flipOrientation();
	            ship.nextFlipAllowed = false;
	       	}
    },
    yourTurn: function(){
		this.myTurn = true;
		console.log('>> it\'s my turn in ' + (this.inPlayPhase ? 'play-phase' : 'setup-phase') + ' says ' + this.name);
	},
	yourTurnIsOver: function(){
		console.log('<< my turn is over says ' + this.name);
	},
	fire: function(xMouse, yMouse){ 	
    	if(this.board.fire(xMouse, yMouse))
    		console.log('yeah, a hit!');
    	else
    		console.log('no hit');
	}
}
