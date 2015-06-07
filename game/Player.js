var Ship = require('./Ship.js');
var Field = require('./Field.js');
var util = require("util");
var EventEmitter = require('events').EventEmitter;

var Player = function(name){
	this.name = name;
	this.opponent;

	this.ships = [];
	this.ships.push(new Ship(3));
	this.ships.push(new Ship(4));
	this.field = new Field();

	this.shipsPlaced = 0;
}

util.inherits(Player, EventEmitter);


	Player.prototype.doSetup = function(callbackFunc){
		this.callbackFunc = callbackFunc;
		this.getShipSetupInput();
	}

	Player.prototype.getShipSetupInput = function(){ // will be "overwritten" in Human and Bot
	}

	Player.prototype.placeShip = function(shipID, orientation, row, col){
		var placementOK = this.field.placeShip(this.ships[shipID], orientation, row, col);
		if(placementOK){ // TODO make this logic more elegant?
			this.shipsPlaced ++;
			if(this.shipsPlaced == this.ships.length)
				this.emit('setupDone', "hello hello");
			else
				this.getShipSetupInput();
		} else 
			this.getShipSetupInput();
	}


module.exports = Player;