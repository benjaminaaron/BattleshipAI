var Player = require('./Player.js');

var Human = function(name){ // local (serverbased) human
	Player.call(this, name);
}

Human.prototype = {
	__proto__: Player.prototype,

	init: function(socket){
		this.socket = socket;
		var self = this;
		socket.on('place', function(args){

			var pieces = args.split(' ');
			var shipID = parseInt(pieces[0]);
			var orientation = String(pieces[1]) == 'h';
			var row = parseInt(pieces[2]);
			var col = parseInt(pieces[3]);

			self.placeShip(shipID, orientation, row, col);

			this.emit('directmessage', self.field.show());
    	});
	},
	getShipSetupInput: function(){
		this.socket.emit('directmessage', 'place shipID orientation row col');	}
}

module.exports = Human;