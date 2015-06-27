
var Ship = function(id, size, color, orientation){ 
    this.id = id;
    this.size = size;
    this.color = color;
    this.orientation = orientation; //true is horizontal, false is vertical
    this.occupyingCells = [];
    this.isMine = size == 1;

    this.hits = 0;
    this.destroyed = false;
}

Ship.prototype = {

    isMine: function() {
        return this.isMine;
    },

    fire: function(){
        var msg;

        if(this.isMine)
            msg = new CellStatusMsg(CellStatus.MINE)

        else {
            this.hits++;

            if(this.hits >= this.size){
                this.destroyed = true;
                msg = new CellStatusMsg(CellStatus.DESTROYED);
                msg.destroyedShipCode = this.size + '_' + (this.orientation ? 'h_' : 'v_') + this.occupyingCells[0].row + '-' + this.occupyingCells[0].col;
            }
            else
                msg = new CellStatusMsg(CellStatus.HIT);
        }

        return msg;
    },

    toString: function(){
        return 'ship: ' + this.id + ' size: ' + this.size + ' color:' + this.color;
    }
};
