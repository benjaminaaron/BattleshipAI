
var Bot = function(name){
    Player.call(this, name);
    this.type = 'bot';
}

Bot.prototype = {
    __proto__: Player.prototype,

    yourSetup: function(){
        Player.prototype.yourSetup.call(this); 

        this.board.randomlyPlaceShips();
        if(this.type == 'bot' && this.opponent.type == 'human'){ // case human vs. bot
            this.board.showShips = false;
            draw();
        }
        
        var self = this;
        setTimeout(function(){ //required to give the Game-constructor time to "finish" the game object, it isn't available yet otherwise
            self.finishedSetup();
        }, 10);        
    },
    yourTurn: function(){
        Player.prototype.yourTurn.call(this);
        var row, col;
        var ok = false;
        while(!ok){
            row = Math.round(Math.random() * (game.rows - 1));
            col = Math.round(Math.random() * (game.cols - 1));
            ok = this.posNotFiredYet(row, col);
        }
        var self = this;
        setTimeout(function(){
            self.fire(row, col);
        }, 10);    
    }
}
