
var AbstractView = function(){}

AbstractView.prototype = {
	init: function(viewContainer){
		this.viewContainer = viewContainer;
		this.player0 = game.player0;
		this.player1 = game.player1;
	},
	handleUpdatedBoard: function(updateReport){
		
	}
}
