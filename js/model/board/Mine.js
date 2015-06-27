/**
 * Represents a mine object (is technically a ship with size '1'.
 * Fires back if hit by opponent's shot.
 * @param id
 * @constructor
 */
var Mine = function(id){
    this.id = id;
    this.size = 1;
    this.color = 'black';
    this.orientation = true; //does not really matter with size 1, does it?
    this.occupyingCells = [];
    this.isMine = true;
    this.hits = 0;
    this.destroyed = false;
}

Mine.prototype = {

    __proto__: Ship.prototype,

    fire: function(){
        Ship.prototype.fire.call(this);

        return new CellStatusMsg(CellStatus.MINE);
    },
    toString: function(){
        return 'mine: ' + this.id;
    }
};