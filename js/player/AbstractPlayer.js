
var AbstractPlayer = function(name){
    this.name = name;
    this.myTurn = false;
    this.inPlayPhase = false;
    this.opponent = null;
}

AbstractPlayer.prototype = {
    init: function(id, board){
        this.id = id;
        this.board = board;
        this.canvas = board.canvas;

        this.fieldMemory = new AbstractField(board.rows, board.cols); 
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
        console.log(this.name + ' cellStatus after shot:');
        switch(result){
            case cellStatus.FIRED:
                console.log('no hit');
                break;
            case cellStatus.HIT:
                console.log('hit');
                break;
            case cellStatus.DESTROYED:
                console.log('destroyed');
                break;
            case cellStatus.ALLSHIPSDESTROYED:
                console.log('all ships destroyed');
                game.iWon(this, this.fieldMemory.countFiredCells());
                break;  
        }
        this.fieldMemory.setCellStatus(row, col, result);
        this.finishedTurn();
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
