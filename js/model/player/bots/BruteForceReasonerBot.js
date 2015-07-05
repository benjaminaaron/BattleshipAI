
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

        var threshold = this.fieldMemory.rows * this.fieldMemory.cols - this.fieldMemory.countUntouchedCells();
        if(Driver.verboseLogging)
            console.log('threshold: ' + threshold + ' (BruteForceReasoner activates at 30 and two destroyed ship)');

        var self = this;
        //var biggestUntouchedArea = Zone.getBiggestArea(this.fieldMemory);

        var firePos;
        var useReasoner;
        var reasoner;
        var assessment;

        if(threshold < 25 || this.destroyedShipThreshold < 2 || this.goal != null){ // goal is questionable here, let him finish the distruction first?
            useReasoner = false;
        }
        else {
            var inputfield = this.convertFieldMemoryToRField();

            var cap = 1500;

            reasoner = new Reasoner(game.shipTypes, inputfield, cap);
            assessment = reasoner.getAssessment();

            if(assessment.reachedCap || assessment.chosenFirePos == null)
                useReasoner = false;
            else
                useReasoner = true;
        }

        if(!useReasoner){
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
        else { // use reasoner
            this.goal = null;

            if(Driver.verboseLogging)
                console.log('reasoner assessment:');
            if(Driver.verboseLogging)
                console.log(assessment);

            var firePos = assessment.chosenFirePos;
            if(Driver.verboseLogging)
                console.log('firing at: ' + firePos.row + '/' + firePos.col);

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
