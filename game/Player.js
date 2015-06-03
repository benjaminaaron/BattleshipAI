var Ship = require('./Ship.js');
var Field = require('./Field.js');

var Player = function(name){
	this.name = name;
	this.ships = [];
	this.ships.push(new Ship(3));
	this.ships.push(new Ship(4));
	this.field = new Field();

	this.shipsPlaced = 0;
}

Player.prototype = {
	doSetup: function(callbackFunc){
		this.callbackFunc = callbackFunc;
		this.getShipSetupInput();
	},
	getShipSetupInput: function(){ // will be "overwritten" in Human and Bot
	},
	placeShip: function(shipID, orientation, row, col){
		var placementOK = this.field.placeShip(this.ships[shipID], orientation, row, col);
		if(placementOK){ // TODO make this logic more elegant?
			this.shipsPlaced ++;
			if(this.shipsPlaced == this.ships.length)
				this.callbackFunc(this);
			else
				this.getShipSetupInput();
		} else 
			this.getShipSetupInput();
	}
}

module.exports = Player;