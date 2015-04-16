
var ShipType = function(size, color, quantity){
    this.size = size;
    this.color = color;
    this.quantity = quantity;
}

var Ship = function(id, size, color){ 
    this.id = id;
    this.size = size;
    this.color = color;
    this.orientation; //true is horizontal, false is vertical

    this.w; // actual width & height
    this.h;
    this.x; // actual x & y position
    this.y;

    this.storeDiffAllowed = true; // to store the difference btwn top-left corner of ship and grabbing pos just in the moment of grabbing
    
    this.occupyingCells = [];

    this.hits = 0;
    this.destroyed = false;
    this.fire = function(){ // does it need to know which cells are hit? don't think so
        this.hits ++;
        if(this.hits >= this.size){
            this.destroyed = true;
            var msg = new CellStatusMsg(CellStatus.DESTROYED);
            msg.destroyedShip = this;
            return msg;
        }
        return new CellStatusMsg(CellStatus.HIT);
    };
}

Ship.prototype = {
    initPlacement: function(posNumb, orientation, cellSizePx, fieldRight, fieldTop){
        this.wHoriz = cellSizePx * this.size;
        this.hHoriz = cellSizePx;
        this.wVert = this.hHoriz;
        this.hVert = this.wHoriz;
        this.orientation = orientation; 
        this.w = orientation ? this.wHoriz : this.wVert;
        this.h = orientation ? this.hHoriz : this.hVert;
        this.x = fieldRight + 15;
        this.y = fieldTop + 20 + posNumb * cellSizePx * 2; // x,y points always to top left corner of rect
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
        if(this.orientation){ //it was horizontal and goes now vertical
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
        this.orientation = !this.orientation;
    },
    toString: function(){
        return 'ship: ' + this.id + ' size: ' + this.size + ' color:' + this.color;
    }
};
