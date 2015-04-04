
var RandomDestroyerBot = function(name){
    AbstractBot.call(this, name);
    this.type = 'bot';
}

RandomDestroyerBot.prototype = {
    __proto__: AbstractBot.prototype,

    yourSetup: function(){
        AbstractBot.prototype.yourSetup.call(this); 
        this.board.randomlyPlaceShips();  	
    },
    yourTurn: function(){
        AbstractBot.prototype.yourTurn.call(this);

        var row, col;

        /* 
        TODO: fires randomly but as soon as a hit is taken it will work to destroy that ship. afterwards random firing continues until the next hit and so on.
        Hint: already fired positions and their shotTypes (none, hit, destroyed) are stored in this.firedMemory 
        */
     
        setTimeout(function(){
            self.fire(row, col);
        }, 10);    
    }
}
