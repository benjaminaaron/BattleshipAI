
var BruteForceReasonerBot = function(name){
    AbstractBot.call(this, name);
    this.type = 'bot';
}

BruteForceReasonerBot.prototype = {
    __proto__: AbstractBot.prototype,

    yourSetup: function(){
        AbstractBot.prototype.yourSetup.call(this);
        this.board.randomlyPlaceShips();
        game.updatedBoard(UpdateReport.SHIPSWERERANDOMLYPLACED);
    },

    yourTurn: function(){
        AbstractBot.prototype.yourTurn.call(this);
        var firePos;

        var threshold = this.fieldMemory.rows * this.fieldMemory.cols - this.fieldMemory.countUntouchedCells();
        console.log('threshold: ' + threshold + ' (BruteForceReasoner activates at 30)');

        if(threshold < 30){
            firePos = Zone.getCentreOfBiggestRect(this.fieldMemory);
        }
        else {
            var inputfield = this.convertFieldMemoryToRField();

            console.log(inputfield + '');
            var reasoner = new Reasoner(game.shipTypes, inputfield);
            var firePos = reasoner.chosenFirePos;
            console.log(">> fire at: " + firePos + ' (' + reasoner.equallyBestFirePos_length + ')');

            if(!firePos) //fallback-plan if reasoner cant deliver
                firePos = Zone.getCentreOfBiggestRect(this.fieldMemory);
        }

        var self = this;
        setTimeout(function(){
            self.fire(firePos.row, firePos.col);
        }, 10);
    },

    convertFieldMemoryToRField: function(){
        var rows = this.fieldMemory.rows;
        var cols = this.fieldMemory.cols;
        var rField = new RField(rows, cols);
        for(var r = 0; r < rows; r ++)
            for(var c = 0; c < cols; c ++)
                rField.cells[r][c] = this.fieldMemory.getCellByRowCol(r, c).status;
        return rField;
    }

}
