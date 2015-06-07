var Game = function(io, player0, player1){
	this.io = io;
	this.player0 = player0;
	this.player0.opponent = player1;
	this.player1 = player1;
	this.player1.opponent = player0;
	this.setupCount = 0;

	this.inPlayPhase = false;
}

Game.prototype = {
	start: function(){
		var self = this;
		var firstPlayerDone = false;

		var setupDone = function(player) {
			if(firstPlayerDone) {
				self.io.emit("broadcast","all players done. starting game");
				self.startGame();
			}
				
			else
				firstPlayerDone = true;
		}

		this.player0.on('setupDone', function() {
			setupDone(self.player0);
		});
		this.player1.on('setupDone', function() {
			setupDone(self.player1);
		});

		this.player0.doSetup();
		this.player1.doSetup();
	},

	startGame: function() {
		this.io.emit("broadcast", "setup Phase finished, It's" + this.player0.name+"'s turn.");
		this.player0.fire();

	},
	turnDoneCallbackFunc: function(player){

	}
}

module.exports = Game;