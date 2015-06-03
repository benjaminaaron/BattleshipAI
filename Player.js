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
	getShipSetupInput: function(){
	},
	placeShip: function(shipID, orientation, row, col){
		var placementOK = this.field.placeShip(this.ships[shipID], orientation, row, col);
		if(placementOK){
			this.shipsPlaced ++;
			if(this.shipsPlaced == this.ships.length)
				this.callbackFunc(this);
			else
				this.getShipSetupInput();
		} else {
			console.log('that was not a valid placement, try again');
			this.getShipSetupInput();
		}
	}
}

module.exports = Player;