
var Player = function(name){
    this.name = name;
    this.myTurn = false;
    this.inPlayPhase = false;
    this.opponent = null;
    this.firedMemory = [];
}

Player.prototype = {
    init: function(id, board){
        this.id = id;
        this.board = board;
        this.canvas = board.canvas;
    },
    setOpponent: function(opponent){
        this.opponent = opponent;
    },
    yourSetup: function(){
        this.myTurn = true;
        $('#container_' + this.id).addClass('activeContainer');    
        console.log('>> i am setting up ships says ' + this.name);
    },
    finishedSetup: function(){
        this.myTurn = false;
        this.inPlayPhase = true;
        $('#container_' + this.id).removeClass('activeContainer');    
        console.log('<< i am done setting up ships says ' + this.name);        
        game.setupCompleted(this);
    },
    yourTurn: function(){
        this.myTurn = true;
        $('#container_' + this.id).addClass('activeContainer');    
        console.log('>> it\'s my turn says ' + this.name);
    },
    fire: function(row, col){
        var result = game.fire(this, row, col);
        console.log(this.name + ' shot was:');
        switch(result){
            case shot.NONE:
                console.log('no hit');
                break;
            case shot.HIT:
                console.log('hit');
                break;
            case shot.DESTROYED:
                console.log('destroyed');
                break;
            case shot.ALREADYSHOT:
                console.log('already shot');
                break;
            case shot.ALLDESTROYED:
                console.log('all ships destroyed');
                game.iWon(this);
                break;  
        }
        this.firedMemory.push(new GridPos(true, row, col));
        this.finishedTurn();
    },
    posNotFiredYet: function(row, col){
        for(var i=0; i < this.firedMemory.length; i++)
            if(this.firedMemory[i].row == row && this.firedMemory[i].col == col)
                return false;
        return true;
    },
    finishedTurn: function(){
        this.myTurn = false;
        $('#container_' + this.id).removeClass('activeContainer');    
        console.log('<< my turn is over says ' + this.name);
        game.turnCompleted(this);
    },
    mousedown: function(xMouse, yMouse){},
    mousemove: function(xMouse, yMouse){},
    mouseup: function(xMouse, yMouse){}
};


/*          var Animal = function(){
                this.legs;
                this.owner;
            }
            Animal.prototype = {
                init: function(legs, owner){
                    console.log(legs, owner);
                    this.legs = legs;
                    this.owner = owner;
                }
            };

            var Dog = function(){
                Animal.call(this);
            }
            Dog.prototype = {
                __proto__: Animal.prototype,

                init: function(legs, owner){
                    this.__proto__.init(legs, owner); 
                    //Animal.prototype.init.call(this, legs, owner); 
                    this.character = 'loyal';
                }
            }
            var myDog = new Dog();
            myDog.init(4, 'Max');
*/
