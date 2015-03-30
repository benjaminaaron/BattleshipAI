
var Game = function(players, shipTypes, xDim, yDim, gameHook){
    gameHook.innerHTML = '';

    this.players = players;

    var canvasWidthPx = 370;
    var canvasHeightPx = 300;

    this.boards = [];

    for(var i=0; i < players.length; i++){
        var jQueryCanvas = this.buildBoardDOMelements(gameHook, i, canvasWidthPx, canvasHeightPx);
        var board = new Board(i, players[i], shipTypes, $(jQueryCanvas)[0], xDim, yDim);
        players[i].board = board;

        board.draw();
        this.boards.push(board);
    }

    this.currentPlayerIndex = 0;
    this.players[this.currentPlayerIndex].myTurn = true;
    this.activeBoard = this.boards[this.currentPlayerIndex];
    this.activeBoard.iAmActiveBoard = true;
    $('#container_' + this.currentPlayerIndex).addClass('activeContainer');
    $('#doneBtn_' + this.currentPlayerIndex).prop('disabled', false);
    $('#randomBtn_' + this.currentPlayerIndex).prop('disabled', false);

    this.initDrawDone = false; // draws all boards for the first time, after that only the active board will be re-drawn upon action
}

Game.prototype = {
    draw: function(){
        if(!this.initDrawDone){
            for(var i=0; i < this.boards.length; i++)
                this.boards[i].draw();
            this.initDrawDone = true;
        }      
        if(this.activeBoard.drawMe || this.activeBoard.oneMoreDraw){
            this.activeBoard.oneMoreDraw = false;
            this.activeBoard.draw();
            animate = true;
        }
        else
            animate = false;
    },
    buildBoardDOMelements: function(gameHook, boardNumb, canvasWidthPx, canvasHeightPx){
        var container = $('<div>').attr({
            'id': 'container_' + boardNumb,
            'class': 'container'
        });
        $(gameHook).append(container);

        var canvas = $('<canvas>').attr({
            'id': 'canvas_' + boardNumb,
            'width': canvasWidthPx,
            'height': canvasHeightPx
        });
        $(container).append(canvas);

        var btnList = $('<ul>').attr({
            'class': 'btnList'
        });
        $(container).append(btnList);
        
        var listElement = $('<li>');
        $(btnList).append(listElement);
        var doneBtn = $('<input>').attr({
            'id': 'doneBtn_' + boardNumb,
            'type': 'button',
            'value': 'done',
            'disabled': true
        });
        var self = this;
        $(doneBtn).click(function(){
            self.doneClicked();
        });  
        $(listElement).append(doneBtn);

        listElement = $('<li>');
        $(btnList).append(listElement);
        var randomBtn = $('<input>').attr({
            'id': 'randomBtn_' + boardNumb,
            'type': 'button',
            'value': 'random',
            'disabled': true
        });
        $(randomBtn).click(function(){
            self.activeBoard.randomlyPlaceShips();
        }); 
        $(listElement).append(randomBtn);

        return canvas;
    },
    doneClicked: function(){
        this.nextPlayersTurn();
    },
    nextPlayersTurn: function(){
        this.players[this.currentPlayerIndex].myTurn = false;
        this.activeBoard.iAmActiveBoard = false;
        $('#container_' + this.currentPlayerIndex).removeClass('activeContainer');
        $('#doneBtn_' + this.currentPlayerIndex).prop('disabled', true);
        $('#randomBtn_' + this.currentPlayerIndex).prop('disabled', true);
        this.currentPlayerIndex ++;
        if(this.currentPlayerIndex >= this.players.length)
            this.currentPlayerIndex = 0;
        this.players[this.currentPlayerIndex].myTurn = true;
        this.activeBoard = this.boards[this.currentPlayerIndex];
        this.activeBoard.iAmActiveBoard = true;
        $('#container_' + this.currentPlayerIndex).addClass('activeContainer');
        $('#doneBtn_' + this.currentPlayerIndex).prop('disabled', false);
        $('#randomBtn_' + this.currentPlayerIndex).prop('disabled', false);
    }
}

function initDraw(){
    window.requestAnimationFrame(draw);
}

function draw(){
    game.draw();
    if(animate)
        window.requestAnimationFrame(draw);
}
