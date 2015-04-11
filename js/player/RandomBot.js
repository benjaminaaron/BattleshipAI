
var RandomBot = function(name){
    AbstractBot.call(this, name);
    this.type = 'bot';
}

RandomBot.prototype = {
    __proto__: AbstractBot.prototype,

    yourSetup: function(){
    	AbstractBot.prototype.yourSetup.call(this);
        this.board.randomlyPlaceShips();	 
    },
    yourTurn: function(){
        AbstractBot.prototype.yourTurn.call(this);
        this.randomFire();
    }
}
