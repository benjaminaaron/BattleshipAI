
var Board = function(id, player, shipTypes, canvas, xDim, yDim){
    this.id = id;
    this.player = player;
    this.field = new Field(xDim, yDim);

    this.xDim = xDim;
    this.yDim = yDim;
    this.xOffset = 30;
    this.yOffset = 60;
    this.cellSizePx = 20;
    this.rotationSwitchX = this.xOffset + this.xDim * this.cellSizePx + 30;
    this.rotationSwitchY = this.yOffset - 40;
    this.rotationSwitchSize = 30;

    this.isActive = false;

    //add ships as defined in shipTypes
    this.ships = [];
    for(var i=0; i < shipTypes.length; i++)
    	for(var j=0; j < shipTypes[i].quantity; j++){
            var ship = new Ship(this, id + '-' + this.ships.length, shipTypes[i].size, shipTypes[i].color);
            ship.drawInit(this.ships.length, true);
    		this.ships.push(ship);
        }

    this.ctx = canvas.getContext('2d');

    this.selectedShip = null;

    var self = this;
    $(canvas).mousedown(function(e){
        self.mousedown(e);
    });
    $(canvas).mousemove(function(e){
        self.mousemove(e);
    });
    $(canvas).mouseup(function(e){
        self.mouseup(e);
    });
}

Board.prototype = {
    draw: function(){
            var ctx = this.ctx;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 

            // board frame
            ctx.strokeStyle = 'black';     
            ctx.lineWidth = 1;
            ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);   

            // name
            ctx.fillStyle = 'navy';
            ctx.font = '20px georgia';       
            ctx.fillText(this.player.name, this.xOffset, this.yOffset - 30);

            // field
            this.field.draw(ctx, this.cellSizePx, this.xOffset, this.yOffset);
            
            // ships
            for(var i=0; i < this.ships.length; i++)
                this.ships[i].draw(ctx);

            //rotation switch
            ctx.fillStyle = '#DDD';    
            ctx.fillRect(this.rotationSwitchX, this.rotationSwitchY, this.rotationSwitchSize, this.rotationSwitchSize);   

            ctx.fillStyle = 'gray';
            ctx.font = '14px georgia';       
            ctx.fillText('R', this.rotationSwitchX + 10, this.rotationSwitchY + 20);
    },
    mousedown: function(e){
        this.selectedShip = this.getSelectedShip(e.offsetX, e.offsetY); //console.log(this.selectedShip);
        this.isActive = true;
    },
    mousemove: function(e){ //console.log(e.offsetX + '  ' + e.offsetY);
        if(this.selectedShip != null){
            var x = e.offsetX;
            var y = e.offsetY;
            this.selectedShip.move(x, y);
            window.requestAnimationFrame(draw);
        }  
    },  
    mouseup: function(e){
        if(this.selectedShip != null){
            this.selectedShip.movingStopped();
            this.selectedShip = null;
        }  
        this.isActive = false;
    },
    getSelectedShip: function(x, y){
        for(var i=0; i < this.ships.length; i++)
            if(this.ships[i].isOnMe(x,y))
                return this.ships[i];
        return null;
    }
};
