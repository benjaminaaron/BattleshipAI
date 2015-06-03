var Player = require('./Player.js');

var Human = function(name, socket){ // local (serverbased) human
	Player.call(this, name);
	this.socket = socket;
}

Human.prototype = {
	__proto__: Player.prototype,

	getShipSetupInput: function(){
	}
}

module.exports = Human;