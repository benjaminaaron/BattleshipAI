
var BruteForceReasonerBot = function(name){
    AbstractBot.call(this, name);
    this.type = 'bot';
    this.goal = null;
    this.destroyedShipThreshold = 0;
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
        if(Driver.verboseLogging)
            console.log('threshold: ' + threshold + ' (BruteForceReasoner activates at 30 and two destroyed ship)');

        var self = this;
        //var biggestUntouchedArea = Zone.getBiggestArea(this.fieldMemory);

        if(threshold < 35 || this.destroyedShipThreshold < 3){ 
            var lastTouchedCell = this.fieldMemory.lastTouchedCell;
            if(lastTouchedCell){
                if(lastTouchedCell.status == CellStatus.HIT && this.goal == null)
                    this.goal = new DestructionGoal(lastTouchedCell, this);
                if(lastTouchedCell.status == CellStatus.DESTROYED){
                    this.goal = null;
                    this.destroyedShipThreshold ++;
                }
            }
            if(this.goal)
                this.goal.think();
            else
                setTimeout(function(){
                    var firePos = Zone.getCentreOfBiggestRect(self.fieldMemory);
                    self.fire(firePos.row, firePos.col);
                }, 10);
        }
        else {
            this.goal = null;
            var inputfield = this.convertFieldMemoryToRField();

            var reasoner = new Reasoner(game.shipTypes, inputfield);
            if(Driver.verboseLogging)
                console.log('reasoner assessment:');
            var assessment = reasoner.getAssessment();
            if(Driver.verboseLogging)
                console.log(assessment);

            var firePos = assessment.chosenFirePos;
            if(Driver.verboseLogging)
                console.log('firing at: ' + firePos.row + '/' + firePos.col);

            if(!firePos) //fallback-plan if reasoner cant deliver
                firePos = Zone.getCentreOfBiggestRect(this.fieldMemory);

            setTimeout(function(){
                self.fire(firePos.row, firePos.col);
            }, 10);
        }

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
