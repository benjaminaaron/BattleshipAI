var GameObserver = function(caller){

    this.winnerFieldMemoryCells = caller.fieldMemory.cells;
    this.looserFieldMemoryCells = caller.opponent.fieldMemory.cells;
    this.fieldMemories = [];
}

GameObserver.prototype = {
    storeData: function() {
        var i;
        var cell;
        
        for(i=0; i < this.winnerFieldMemoryCells.length; i++){
            cell = this.winnerFieldMemoryCells[i];
            
            if(cell.status == CellStatus.UNTOUCHED || cell.status == CellStatus.SPARE)
                this.fieldMemories.push(0);
            else
                this.fieldMemories.push(1);
        }
        
        for(i=0; i < this.looserFieldMemoryCells.length; i++){
            cell = this.looserFieldMemoryCells[i];
            
            if(cell.status != CellStatus.UNTOUCHED && cell.status != CellStatus.SPARE)
                this.fieldMemories[i] += 1;
        }

        var self = this;
        firebase.once('value', function(dataSnapshot) {

            var fieldMemoryStored;
            var id;
            // TODO: loop is ugly. consider replacing it
            var entries = dataSnapshot.val();
            for (var indexStr in entries) {
               id = indexStr;
                if (entries.hasOwnProperty(indexStr)) {
                   fieldMemoryStored  = entries[indexStr];
                }
            }
            for (var index in fieldMemoryStored.fieldMemories){
                self.fieldMemories[index] += fieldMemoryStored.fieldMemories[index];
            }
            
            console.log(self.fieldMemories);
            
            var itemRef = new Firebase('https://torrid-inferno-2196.firebaseio.com/' + id);
            itemRef.remove();
            firebase.push({fieldMemories: self.fieldMemories});
        });
    } 
}
