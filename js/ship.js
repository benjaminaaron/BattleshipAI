
var ShipType = function(size, color, quantity){
	this.size = size;
	this.color = color;
	this.quantity = quantity;
}

var Ship = function(id, size, color, cellSizePx, fieldLeft, fieldTop){ 
    this.id = id;
    this.size = size;
    this.color = color;
    this.orientation; //true is horizontal, false is vertical

    this.cellSizePx = cellSizePx;
    this.fieldLeft = fieldLeft;
    this.fieldTop = fieldTop;

    this.wHoriz = this.cellSizePx * this.size;
    this.hHoriz = this.cellSizePx;
    this.wVert = this.hHoriz;
    this.hVert = this.wHoriz;

    this.w; // actual width & height
    this.h;
    this.x; // actual x & y position
    this.y;

    this.occupyingCells = [];

    this.storeDiffAllowed = true; // to store the difference btwn top-left corner of ship and grabbing pos just in the moment of grabbing
    this.nextFlipAllowed = true; // to avoid ongoing flipping while ship touches rotation area 
}

Ship.prototype = {
    initPlacement: function(posNumb, orientation){
        this.orientation = orientation; 
        this.w = orientation ? this.wHoriz : this.wVert;
        this.h = orientation ? this.hHoriz : this.hVert;
        this.x = this.fieldLeft + 15;
        this.y = this.fieldTop + 20 + posNumb * this.cellSizePx * 2; // x,y points always to top left corner of rect
    },
    draw: function(ctx){
        ctx.fillStyle = this.color;   
        ctx.fillRect(this.x, this.y, this.w, this.h);
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
        this.nextFlipAllowed = true;
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
        this.storeDiffAllowed = true; // position of ship has changed, therefore need to allow the calc of new difference    
    },
    toString: function(){
        return 'ship: ' + this.id + ' size: ' + this.size + ' color:' + this.color;
    }
};
