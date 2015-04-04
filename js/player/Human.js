
var Human = function(name){
    AbstractPlayer.call(this, name);
    this.type = 'human';

    this.selectedShip = null;
}

Human.prototype = { 
    __proto__: AbstractPlayer.prototype,

    init: function(id, board){
        AbstractPlayer.prototype.init.call(this, id, board); 
        var canvas = board.canvas;
    },
    yourSetup: function(){
        AbstractPlayer.prototype.yourSetup.call(this); 
        if(this.type == 'human' && this == this.opponent){ // case single human
            this.board.randomlyPlaceShips();
            this.board.showShips = false;
            var self = this;
            setTimeout(function(){
                self.finishedSetup();
            }, 10); 
        } 
    },
     mousedown: function(xMouse, yMouse){    
        AbstractPlayer.prototype.mousedown.call(this, xMouse, yMouse);   
        if(!this.inPlayPhase){
            this.xMousedown = xMouse;
            this.yMousedown = yMouse;
            var ship = this.board.getSelectedShip(xMouse, yMouse);
            if(ship){
                this.board.revokeShipPlacement(ship);
                this.selectedShip = ship;
            }
        }
        else
            this.fireOnCoords(xMouse, yMouse);
    },
    mousemove: function(xMouse, yMouse){
        AbstractPlayer.prototype.mousemove.call(this, xMouse, yMouse); 
        var mousemoved = Math.abs(this.xMousedown - xMouse) > 2 || Math.abs(this.yMousedown - yMouse) > 2;
        var ship = this.selectedShip;
        if(mousemoved && ship){
            ship.moveTo(xMouse, yMouse);
            if(this.board.shipIsCompletelyOverField(ship))
                 this.board.shipMovesOverField(ship);  
            draw();        
        } 
    },
    mouseup: function(xMouse, yMouse){
        AbstractPlayer.prototype.mouseup.call(this, xMouse, yMouse); 
        var isClick = Math.abs(this.xMousedown - xMouse) < 2 && Math.abs(this.yMousedown - yMouse) < 2;
        var ship = this.selectedShip;
        if(isClick){
            if(ship)
                this.board.flipShipsOrientation(ship);
            else
                if(this.board.posIsOverField(xMouse, yMouse))
                    this.board.randomlyPlaceShips();
                else
                    if(this.board.allShipsPlaced())
                        this.finishedSetup();
                    else
                        alert('not all ships are placed yet');
        } else
            if(ship){
                ship.movingStopped();
                this.board.placeShip(ship);
            }
        this.selectedShip = null;
        draw();
    },
    fireOnCoords: function(xMouse, yMouse){
        if(this.board.posIsOverField(xMouse, yMouse)){
            var relXpos = xMouse - this.board.fieldLeft;
            var relYpos = yMouse - this.board.fieldTop;
            var cellSizePx = this.board.cellSizePx;
            var row = Math.abs(Math.round((relYpos - cellSizePx / 2) / cellSizePx));
            var col = Math.abs(Math.round((relXpos - cellSizePx / 2) / cellSizePx));     
            if(this.posNotFiredYet(row, col))
                this.fire(row, col);
        }
    }
}
