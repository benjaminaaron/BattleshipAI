
var ConsoleController = function(human){
    AbstractController.call(this, human);
}

ConsoleController.prototype = {
    __proto__: AbstractController.prototype,
    func: function(){         
    
    },
    extendFunc: function(){
        AbstractController.prototype.handleUpdatedBoard.call(this);
    }
}
