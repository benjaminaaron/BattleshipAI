var Player = require('./Player.js');

var Bot = function(){
	Player.call(this);
}

Bot.prototype = {
	__proto__: Player.prototype,

	getShipSetupInput: function(){
		if(this.shipsPlaced == 0)
			this.placeShip(0, true, 2, 2);
		else
			this.placeShip(1, false, 4, 5);
	}
}

module.exports = Bot;