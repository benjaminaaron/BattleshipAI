
var Ship = function(id, size, color, orientation){ 
    this.id = id;
    this.size = size;
    this.color = color;
    this.orientation = orientation; //true is horizontal, false is vertical

    this.occupyingCells = [];

    this.hits = 0;
    this.destroyed = false;
}

Ship.prototype = {
    fire: function(){ // does it need to know which cells are hit? don't think so
        this.hits ++;
        if(this.hits >= this.size){
            this.destroyed = true;
            var msg = new CellStatusMsg(CellStatus.DESTROYED);
            msg.destroyedShipCode = this.size + '_' + (this.orientation ? 'h_' : 'v_') + this.occupyingCells[0].row + '-' + this.occupyingCells[0].col;
            return msg;
        }
        return new CellStatusMsg(CellStatus.HIT);
    },
    toString: function(){
        return 'ship: ' + this.id + ' size: ' + this.size + ' color:' + this.color;
    }
};
