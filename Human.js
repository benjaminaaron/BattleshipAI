var Player = require('./Player.js');
var prompt = require('prompt');

var Human = function(){ // local (serverbased) human
	Player.call(this);
}

Human.prototype = {
	__proto__: Player.prototype,

	getShipSetupInput: function(){
		prompt.start();
		var self = this; // to pass the Human-context into prompt.get
		prompt.get('place shipID orientation row col', function(err, result){
			var pieces = result['place shipID orientation row col'].split(' ');
			var shipID = parseInt(pieces[1]);
			var orientation = String(pieces[2]) == 'h';
			var row = parseInt(pieces[3]);
			var col = parseInt(pieces[4]);
			self.placeShip(shipID, orientation, row, col);
		});
	}
}

module.exports = Human;