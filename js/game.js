
var Game = function(players, shipTypes, totalRows, totalCols, gameHook){
    gameHook.innerHTML = '';
    this.players = players;
    this.buildGameControlDOM(gameHook);

    this.boards = [];

    for(var i=0; i < players.length; i++){
        var container = $('<div>').attr({
            'id': 'container_' + i,
            'class': 'container'
        });
        $(gameHook).append(container);

        var board = new Board(i, container, this.btnCallback, players[i], shipTypes, totalRows, totalCols); //$(jQueryCanvas)[0] gets the pure canvas element without the jQuery Wrapper
        players[i].board = board;
        board.draw(); // draw them here instead of in draw() func with a initDrawDone toggle, seems better
        this.boards.push(board);
    }

    this.currentPlayerIndex;
    this.currentPlayer = null;
    this.activeBoard = null;

    this.inPlayPhase = false;
}

Game.prototype = {
    draw: function(){   
        if(this.activeBoard.drawMe || this.activeBoard.oneMoreDraw){
            this.activeBoard.oneMoreDraw = false;
            this.activeBoard.draw();
            animate = true;
        }
        else
            animate = false;
    },
    buildGameControlDOM: function(gameHook){
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

    shutDownPlayerInSetupPhase: function(){
        $('#container_' + this.currentPlayerIndex).removeClass('activeContainer');
        if(!this.inPlayPhase){
            $('#doneBtn_' + this.currentPlayerIndex).prop('disabled', true);
            $('#randomBtn_' + this.currentPlayerIndex).prop('disabled', true);
        }
        this.currentPlayer.yourTurnIsOver();
    },
    startUpPlayerInSetupPhase: function(){
        this.activeBoard = this.boards[this.currentPlayerIndex];
        $('#container_' + this.currentPlayerIndex).addClass('activeContainer');
        if(!this.inPlayPhase){
            $('#doneBtn_' + this.currentPlayerIndex).prop('disabled', false);
            $('#randomBtn_' + this.currentPlayerIndex).prop('disabled', false);
        }
        this.currentPlayer = this.players[this.currentPlayerIndex];
        this.currentPlayer.yourTurn();
    },


    nextPlayersTurn: function(){     
        this.shutDownPlayerInSetupPhase();
        this.currentPlayerIndex ++;

        if(this.currentPlayerIndex >= this.players.length){       
            this.currentPlayerIndex = 0;    
            if(!this.inPlayPhase){
                $('#statusLabel').html('&nbsp;&nbsp;&nbsp;in <b>play-phase</>');            
                this.inPlayPhase = true;
                for(var i=0; i < this.players.length; i++){
                    this.players[i].switchBtwnPhases(true);
                    if(this.players[i].type == 'human'){
                        $('#doneBtn_' + i).hide();
                        $('#randomBtn_' + i).hide();
                    }
                }
            } 
        }

        this.startUpPlayerInSetupPhase();
    },
    startBtnClicked: function(){
        if(this.currentPlayer == null){ 
            $('#statusLabel').html('&nbsp;&nbsp;&nbsp;in ship-setup phase');
            $('#startBtn').prop('value', 'reset'); 
            this.currentPlayerIndex = 0;
            this.startUpPlayerInSetupPhase();         
        }
        else
            location.reload();
    },
    infoBtnClicked: function(){
        alert('some info here...');
    },
}
