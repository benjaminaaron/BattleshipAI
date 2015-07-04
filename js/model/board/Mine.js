/**
 * Represents a mine object (is technically a ship with size '1'.
 * Fires back if hit by opponent's shot.
 * @param id
 * @constructor
 */
var Mine = function(id, color){
    Ship.call(this, id, 1, color, true);
}

Mine.prototype = {

    __proto__: Ship.prototype,

    fire: function(){
        console.log('hit a mine!');

        return new CellStatusMsg(CellStatus.MINE);

        //TODO fire back randomly
    },

    toString: function(){
        return 'mine: ' + this.id;
    }
};
