
var ShipWrapper = function(player, ship, posNumb, cellSizePx, fieldLeft, fieldRight, fieldTop){ 
    this.player = player;
    this.ship = ship;

    this.w; // actual width & height
    this.h;
    this.x; // actual x & y position
    this.y;

    this.storeDiffAllowed = true; // to store the difference btwn top-left corner of ship and grabbing pos just in the moment of grabbing

    this.wHoriz = cellSizePx * ship.size;
    this.hHoriz = cellSizePx;
    this.wVert = this.hHoriz;
    this.hVert = this.wHoriz;
    this.w = this.ship.orientation ? this.wHoriz : this.wVert;
    this.h = this.ship.orientation ? this.hHoriz : this.hVert;

    this.x = fieldRight + 15;
    this.y = fieldTop + 20 + posNumb * cellSizePx * 2; // x,y points always to top left corner of rect

    this.cellSizePx = cellSizePx;
    this.fieldLeft = fieldLeft;
    this.fieldTop = fieldTop;
}

ShipWrapper.prototype = {
    update: function(){
        this.w = this.ship.orientation ? this.wHoriz : this.wVert;
        this.h = this.ship.orientation ? this.hHoriz : this.hVert;
        var headCell = this.ship.occupyingCells[0];
        this.x = this.fieldLeft + headCell.col * this.cellSizePx;
        this.y = this.fieldTop + headCell.row * this.cellSizePx;
    },
    isOnMe: function(x, y){
        return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
    },
    moveTo: function(x, y){
        if(this.storeDiffAllowed){
            this.diffToTopLeftCornerX = this.x - x;
            this.diffToTopLeftCornerY = this.y - y;
            this.storeDiffAllowed = false;
        }
        this.x = x + this.diffToTopLeftCornerX;
        this.y = y + this.diffToTopLeftCornerY;
    },
    movingStopped: function(){
        this.storeDiffAllowed = true;
    },
    flipOrientation: function(){
        if(this.ship.orientation){ //it was horizontal and goes now vertical
            this.w = this.wVert;
            this.h = this.hVert;
            this.x = this.x + this.wHoriz / 2 - this.wVert / 2;
            this.y = this.y + this.hHoriz / 2 - this.hVert / 2;
        } else {
            this.w = this.wHoriz;
            this.h = this.hHoriz;
            this.x = this.x - this.wHoriz / 2 + this.wVert / 2;
            this.y = this.y - this.hHoriz / 2 + this.hVert / 2;
        }
        this.ship.orientation = !this.ship.orientation;
    }
};
