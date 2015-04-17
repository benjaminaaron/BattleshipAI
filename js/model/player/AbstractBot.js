
var AbstractBot = function(name){
    AbstractPlayer.call(this, name);
    this.type = 'bot';
}

AbstractBot.prototype = {
    __proto__: AbstractPlayer.prototype,

    yourSetup: function(){
        AbstractPlayer.prototype.yourSetup.call(this); 

        if(this.type == 'bot' && this.opponent.type == 'human')// case human vs. bot
            this.board.showShips = false;
        
        var self = this;
        setTimeout(function(){ //required to give the Game-constructor time to "finish" the game object, it isn't available yet otherwise
            self.finishedSetup();
        }, 10);        
    },
    yourTurn: function(){
        AbstractPlayer.prototype.yourTurn.call(this); 
    },
    randomFire: function(){
        var untouchedCells = this.fieldMemory.getUntouchedCells();
        var randomCell = untouchedCells[Math.random() * (untouchedCells.length - 1)];
        var self = this;
        setTimeout(function(){
            self.fire(randomCell.row, randomCell.col);
        }, 10);  
    }
}