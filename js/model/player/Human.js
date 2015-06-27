
var Human = function(name){
    AbstractPlayer.call(this, name);
    this.type = 'human';
    this.selectedShipWr = null;
}

Human.prototype = { 
    __proto__: AbstractPlayer.prototype,

    yourSetup: function(){
        AbstractPlayer.prototype.yourSetup.call(this); 
    },
    
    mousedown: function(xMouse, yMouse){    
        if(!this.inPlayPhase){
            this.xMousedown = xMouse;
            this.yMousedown = yMouse;
            var shipWr = viewModule.getSelectedShip(this.ID, xMouse, yMouse);
            if(shipWr){
                viewModule.revokeShipPlacement(shipWr);
                this.selectedShipWr = shipWr;
            }
        }
        else
            this.fireOnCoords(xMouse, yMouse);
    },

    mousemove: function(xMouse, yMouse){
        var mousemoved = Math.abs(this.xMousedown - xMouse) > 2 || Math.abs(this.yMousedown - yMouse) > 2;
        var shipWr = this.selectedShipWr;
        if(mousemoved && shipWr)
            viewModule.shipIsMoving(shipWr, xMouse, yMouse);
    },

    mouseup: function(xMouse, yMouse){
        var isClick = Math.abs(this.xMousedown - xMouse) < 2 && Math.abs(this.yMousedown - yMouse) < 2;
        var shipWr = this.selectedShipWr;
        if(isClick){
            if(shipWr){
                viewModule.flipShipsOrientation(shipWr);
            }
            else 
                if(viewModule.posIsOverField(xMouse, yMouse)){
                    this.board.randomlyPlaceShips();
                    game.updatedBoard(UpdateReport.SHIPSWERERANDOMLYPLACED);
                }
                else
                    this.iAmDoneSettingUp();
                       
        } else
            if(shipWr){
                viewModule.placeShip(shipWr);
            }
        this.selectedShipWr = null;
        
        if(!this.inPlayPhase && this.board.allElementsPlaced())
            $('#readyBtn').show();
    },

    iAmDoneSettingUp: function() {
        if(this.board.allElementsPlaced())
            this.finishedSetup();
        else
            alert('not all elements placed yet');
    },

    fireOnCoords: function(xMouse, yMouse){
        if(viewModule.posIsOverField(xMouse, yMouse)){
            var cell = viewModule.getCellRCbyCoords(xMouse, yMouse);
            var cellStatus = this.fieldMemory.getCellStatus(cell.row, cell.col);
            if(cellStatus == CellStatus.UNTOUCHED || cellStatus == CellStatus.SPARE)
                this.fire(cell.row, cell.col);
        }
    }
}
