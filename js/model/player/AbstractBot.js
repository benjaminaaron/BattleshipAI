
var AbstractBot = function(name){
    AbstractPlayer.call(this, name);
    this.type = 'bot';
}

AbstractBot.prototype = {
    __proto__: AbstractPlayer.prototype,

    yourSetup: function(){
        // equals call to super-funct from java and makes it possible to explicitly state the method's context.
        AbstractPlayer.prototype.yourSetup.call(this);

        if(this.type == 'bot' && this.opponent.type == 'human')// case human vs. bot
            this.board.showShips = true; //TODO false of course :)

        var self = this;
        setTimeout(function(){ //required to give the Game-constructor time to "finish" the game object, it isn't available yet otherwise
            self.finishedSetup();
        }, 10);
    },

    yourTurn: function(){
        AbstractPlayer.prototype.yourTurn.call(this);
    }

}
