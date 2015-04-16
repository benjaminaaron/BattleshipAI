
var StatsView = function(){
	AbstractView.call(this);

}

StatsView.prototype = {
	__proto__: AbstractView.prototype,
	init: function(viewContainer, player0, player1){
		AbstractView.prototype.init.call(this, viewContainer, player0, player1);

	}
}