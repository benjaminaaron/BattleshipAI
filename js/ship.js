
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

    this.xOffset = board.xOffset;
    this.yOffset = board.yOffset;
    this.cellSizePx = board.cellSizePx;
    this.xDim = board.xDim;
    this.yDim = board.yDim;
    this.rotationSwitchX = board.rotationSwitchX;
    this.rotationSwitchY = board.rotationSwitchY;
    this.rotationSwitchSize = board.rotationSwitchSize;
}

Ship.prototype = {
    drawInit: function(posNumb, orientation){
        this.orientation = orientation; //true is horizontal, false is vertical
        this.wHoriz = this.cellSizePx * this.size;
        this.hHoriz = this.cellSizePx;
        this.wVert = this.hHoriz;
        this.hVert = this.wHoriz;
        this.w = orientation ? this.wHoriz : this.wVert;
        this.h = orientation ? this.hHoriz : this.hVert;
        this.x = this.xOffset + (this.xDim * this.cellSizePx) + 15;
        this.y = this.yOffset + posNumb * this.cellSizePx * 2; // x,y points to top left corner of rect
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
    move: function(x, y){
        if(this.storeDiffAllowed){
            this.diffTo00cornerX = this.x - x;
            this.diffTo00cornerY = this.y - y;
            this.storeDiffAllowed = false;
        }
        this.x = x + this.diffTo00cornerX;
        this.y = y + this.diffTo00cornerY;

        if(this.x > this.xOffset && this.x < this.xOffset + this.xDim * this.cellSizePx - this.w && this.y > this.yOffset && this.y < this.yOffset + this.yDim * this.cellSizePx - this.h){
            console.log('ship completely over field')
        }  

        if(this.y < this.rotationSwitchY + this.rotationSwitchSize && this.y + this.h > this.rotationSwitchY && this.x < this.rotationSwitchX + this.rotationSwitchSize && this.x + this.w > this.rotationSwitchX){
            console.log('ship over rotation flip');
            if(this.nextFlipAllowed){
                this.flipOrientation();
                this.nextFlipAllowed = false;
            }
        }
    },
    movingStopped: function(){
        this.storeDiffAllowed = true;
        this.nextFlipAllowed = true;
    },
    reposition: function(){
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
    toString: function(){}
};
