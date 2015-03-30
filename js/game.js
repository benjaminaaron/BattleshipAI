
var Game = function(players, shipTypes, xDim, yDim, gameHook){
    gameHook.innerHTML = '';

    this.players = players;

    this.buildGameControlDOMelements(gameHook);

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

    this.gameHasStarted = false;
    this.activeBoard = null;
    this.initDrawDone = false; // draws all boards for the first time, after that only the active board will be re-drawn upon action
}

Game.prototype = {
    draw: function(){
        if(!this.initDrawDone){
            for(var i=0; i < this.boards.length; i++)
                this.boards[i].draw();
            this.initDrawDone = true;
        }      
        if(this.activeBoard)
            if(this.activeBoard.drawMe || this.activeBoard.oneMoreDraw){
                this.activeBoard.oneMoreDraw = false;
                this.activeBoard.draw();
                animate = true;
            }
            else
                animate = false;
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
        if(this.activeBoard.allShipsPlaced())
            this.nextPlayersTurn();
        else
            alert('not all ships are placed yet');
    },
    nextPlayersTurn: function(){
        this.players[this.currentPlayerIndex].myTurn = false;
        this.activeBoard.iAmActiveBoard = false;
        $('#container_' + this.currentPlayerIndex).removeClass('activeContainer');
        $('#doneBtn_' + this.currentPlayerIndex).prop('disabled', true);
        $('#randomBtn_' + this.currentPlayerIndex).prop('disabled', true);
        this.currentPlayerIndex ++;
        if(this.currentPlayerIndex >= this.players.length){
            $('#statusLabel').html('&nbsp;&nbsp;&nbsp;in play-phase');
            this.currentPlayerIndex = 0;
        }
        this.players[this.currentPlayerIndex].myTurn = true;
        this.activeBoard = this.boards[this.currentPlayerIndex];
        this.activeBoard.iAmActiveBoard = true;
        $('#container_' + this.currentPlayerIndex).addClass('activeContainer');
        $('#doneBtn_' + this.currentPlayerIndex).prop('disabled', false);
        $('#randomBtn_' + this.currentPlayerIndex).prop('disabled', false);
    },
    buildGameControlDOMelements: function(gameHook){
    var gameControls = $('<div>').attr({
        'id': 'gameControls'
        });
    $(gameHook).append(gameControls);

    var nav = $('<nav>');
    $(gameControls).append(nav);

    var startBtn = $('<input>').attr({
        'id': 'startBtn',
        'type': 'button',
        'value': 'start game'
    });
    var self = this;
    $(startBtn).click(function(){
        self.startBtnClicked();
    }); 
    $(nav).append(startBtn);

    var infoBtn = $('<input>').attr({
        'id': 'infoBtn',
        'type': 'button',
        'value': 'info'
    });
    $(infoBtn).click(function(){
        self.infoBtnClicked();
    });  
    $(nav).append(infoBtn);

    var statusLabel = $('<div>').attr({
            'id': 'statusLabel'
        });
    $(statusLabel).append('&nbsp;&nbsp;&nbsp;game hasn\'t started yet');
    $(gameControls).append(statusLabel);
    },
    infoBtnClicked: function(){
        alert('some info here...');
    },
    startBtnClicked: function(){
        if(!this.gameHasStarted){
            this.gameHasStarted = true;
            this.currentPlayerIndex = 0;
            this.players[this.currentPlayerIndex].myTurn = true;
            this.activeBoard = this.boards[this.currentPlayerIndex];
            this.activeBoard.iAmActiveBoard = true;
            $('#container_' + this.currentPlayerIndex).addClass('activeContainer');
            $('#doneBtn_' + this.currentPlayerIndex).prop('disabled', false);
            $('#randomBtn_' + this.currentPlayerIndex).prop('disabled', false);

            $('#statusLabel').html('&nbsp;&nbsp;&nbsp;in ship-setup phase');
            $('#startBtn').prop('value', 'reset');
        }
        else
            location.reload();
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
