var Player = require('./Player.js');

var Human = function(name){ // local (serverbased) human
	Player.call(this, name);
}

//Human.prototype = new Player(name); //alternative vererbungsstruktur

Human.prototype = {
	__proto__: Player.prototype,

	init: function(socket){
		this.socket = socket;
		var self = this;
		socket.on('place', function(args){ // installing listener
			var pieces = args.split(' ');
			var shipID = parseInt(pieces[0]);
			var orientation = String(pieces[1]) == 'h';
			var row = parseInt(pieces[2]);
			var col = parseInt(pieces[3]);

			var shipsPlacedBefore = this.shipsPlaced;

			self.placeShip(shipID, orientation, row, col);

			if(self.shipsPlaced == shipsPlacedBefore)
				this.emit('directmessage', 'invalid placement, try again');
			else
				this.emit('directmessage', self.field.show('<br>', '&nbsp;'));
    	});
    	socket.on('fire', function(args){ // installing listener
			var pieces = args.split(' ');
			var row = parseInt(pieces[0]);
			var col = parseInt(pieces[1]);


    	});
	},
	getShipSetupInput: function(){
		this.socket.emit('directmessage', 'place shipID orientation row col');	
	},
	fire: function(){
		this.socket.emit('directmessage', 'where do you want to shoot?');
		

	}
}

module.exports = Human;