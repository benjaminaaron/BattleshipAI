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
        Ship.prototype.fire.call(this); // maybe the super call is what's causing the trouble?!
        console.log('hit a mine!');

        //TODO fire back randomly
    },

    toString: function(){
        return 'mine: ' + this.id;
    }
};
