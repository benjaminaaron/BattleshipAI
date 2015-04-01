
var AbstractPlayer = function(){
   	this.name;
   	this.myTurn = false;
   	this.inPlayPhase = false;
}

AbstractPlayer.prototype = {
	btnCallback: function(btnType){},
	
	switchBtwnPhases: function(playPhase){
		this.inPlayPhase = playPhase;
	}
};
