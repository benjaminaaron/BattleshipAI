
var ShipType = function(size, color, quantity){
	this.size = size;
	this.color = color;
	this.quantity = quantity;
}

var Ship = function(board, id, size, color){ 
    this.board = board;
    this.id = id;
    this.size = size;
    this.color = color;
    this.occupyingCells = [];
}

Ship.prototype = {
    initPlacement: function(posNumb, orientation, cellSizePx, rightEdgeOfFieldX, yOffset){
        this.orientation = orientation; //true is horizontal, false is vertical
        this.wHoriz = cellSizePx * this.size;
        this.hHoriz = cellSizePx;
        this.wVert = this.hHoriz;
        this.hVert = this.wHoriz;
        this.w = orientation ? this.wHoriz : this.wVert;
        this.h = orientation ? this.hHoriz : this.hVert;
        this.x = rightEdgeOfFieldX + 15;
        this.y = yOffset + 20 + posNumb * cellSizePx * 2; // x,y points to top left corner of rect
        this.storeDiffAllowed = true;
        this.nextFlipAllowed = true;
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
            this.diffTo00cornerX = this.x - x;
            this.diffTo00cornerY = this.y - y;
            this.storeDiffAllowed = false;
        }
        this.x = x + this.diffTo00cornerX;
        this.y = y + this.diffTo00cornerY;
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
        this.storeDiffAllowed = true;
    },
    toString: function(){
        return 'ship: ' + this.id + ' on board: ' + this.board.id + ' size: ' + this.size + ' color:' + this.color;
    }
};
