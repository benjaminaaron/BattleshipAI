
var Bot = function(){
	Player.call(this);
	this.name = 'AI';
	this.type = 'bot';
}
Bot.prototype = {
	__proto__: Player.prototype,

	init: function(board, canvas){
		this.board = board;
	},
	yourTurn: function(){
		this.myTurn = true;
		console.log('>> it\'s my turn in ' + (this.inPlayPhase ? 'play-phase' : 'setup-phase') + ' says ' + this.name);

		if(!this.inPlayPhase){
			var myBoard = game.activeBoard;
			myBoard.randomlyPlaceShips();
			setTimeout(function(){
				game.nextPlayersTurn();
			}, 10);	
		}

	},
	yourTurnIsOver: function(){
		console.log('<< my turn is over says ' + this.name);

	}
}
