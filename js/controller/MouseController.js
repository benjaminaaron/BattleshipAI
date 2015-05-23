
var MouseController = function(human){
    AbstractController.call(this, human);
}

MouseController.prototype = {
    __proto__: AbstractController.prototype,
    func: function(){         
    
    },
    extendFunc: function(){
        AbstractController.prototype.handleUpdatedBoard.call(this);
    },
    handleMouseEvent: function(type, xMouse, yMouse){
        //console.log('mouse event: ' + type);
    }
}
