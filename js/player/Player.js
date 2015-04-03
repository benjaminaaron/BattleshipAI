
var Player = function(){
   	this.name;
   	this.myTurn = false;
   	this.inPlayPhase = false;
}

Player.prototype = {
	btnCallback: function(btnType){},
	
	switchBtwnPhases: function(playPhase){
		this.inPlayPhase = playPhase;
	}
};
