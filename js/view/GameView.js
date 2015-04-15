
var GameView = function(){
	AbstractView.call(this);

}

GameView.prototype = {
	__proto__: AbstractView.prototype,

	init: function(viewContainer, player0, player1){
		AbstractView.prototype.init.apply(this, viewContainer, player0, player1); // call init in super

	 	var canvasWidthPx = 370;
    	var canvasHeightPx = 300;

		var container = $('<div>').attr({
	    	'id': 'container_0',
	        'class': 'container'
	    });
	    $(viewContainer).append(container);

    	var canvas = $('<canvas>').attr({
	        'id': 'canvas_0',
	        'width': canvasWidthPx,
	        'height': canvasHeightPx
    	});
    	$(container).append(canvas);
    	this.canvas0 = $(canvas)[0];
    	this.installCanvasListener(this.canvas0);   


	    if(player1){
	        container = $('<div>').attr({
	            'id': 'container_1',
	            'class': 'container'
	        });
	        $(viewContainer).append(container);

		    canvas = $('<canvas>').attr({
		        'id': 'canvas_1',
		        'width': canvasWidthPx,
		        'height': canvasHeightPx
	    	});
	    	$(container).append(canvas);
	    	this.canvas1 = $(canvas)[0];
	    	this.installCanvasListener(this.canvas1);   
   	 	}

	},
	installCanvasListener: function(canvas, id){
        var self = this;
        $(canvas).on('mousedown touchstart', function(e) {
            e.preventDefault();
            self.handleCanvasEvent(0, canvas, id, e);
        });
        $(canvas).on('mousemove touchmove', function(e) {
            e.preventDefault();
            self.handleCanvasEvent(1, canvas, id, e);     
        });
        $(canvas).on('mouseup touchend', function(e) {
            e.preventDefault();
            self.handleCanvasEvent(2, canvas, id, e);
        });
    },
    handleCanvasEvent: function(type, canvas, id, e){
        var canvasElement = canvas.getBoundingClientRect();
        var xMouse = e.originalEvent.pageX - canvasElement.left;
        var yMouse = e.originalEvent.pageY - canvasElement.top;

/*
        var player = this.currentPlayer;

        var sendCanvasEventToPlayer;
        if(!this.inPlayPhase)
            sendCanvasEventToPlayer = player.board == board;
        else
            if(this.isSingleGame)
                sendCanvasEventToPlayer = true;
            else
                sendCanvasEventToPlayer = player.board != board;

      if(sendCanvasEventToPlayer){
            switch(type){
                case 0:
                    player.mousedown(xMouse, yMouse);
                    break;
                case 1: 
                    player.mousemove(xMouse, yMouse);
                    break;
                case 2:
                    player.mouseup(xMouse, yMouse);
                    break;
            }
        }*/




    },



}