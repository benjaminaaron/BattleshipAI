/*
8 directions:

[NW][ N][NE]
[ W][  ][ E]
[SW][ S][SE]
 */

var Neighbourhood = function(pos, dirArr){
    this.NW = dirArr[0];
    this.N = dirArr[1];
    this.NE = dirArr[2];
    this.W = dirArr[3];
    //pos is dirArr[4]
    this.E = dirArr[5];
    this.SW = dirArr[6];
    this.S = dirArr[7];
    this.SE = dirArr[8];

    this.frame = this.getNonNulls(dirArr);
    this.diagonals = this.getNonNulls([this.NW, this.NE, this.SW, this.SE]);
    this.straights = this.getNonNulls([this.N, this.W, this.E, this.S]); // = non-diagonals

    this.pos = pos;
};

Neighbourhood.prototype = {
    toString: function(){
        var str = 'Neighbourhood of ' + this.pos + ':';
        str += '\n' + CellToCharWrapped(this.NW) + CellToCharWrapped(this.N) + CellToCharWrapped(this.NE);
        str += '\n' + CellToCharWrapped(this.W) + '[@]' + CellToCharWrapped(this.E);
        str += '\n' + CellToCharWrapped(this.SW) + CellToCharWrapped(this.S) + CellToCharWrapped(this.SE);
        return str;
    },

    getNonNulls: function(arr){
        var notNullArr = [];
        for(var i in arr)
            if(arr[i] != null)
                notNullArr.push(arr[i]);
        return notNullArr;
    },

    contains: function(cells, checkcells){
        for(var i in cells)
            if(checkcells.indexOf(cells[i]) != -1)
                return true;
        return false;
    },

    canItBeFIRED: function(){
        var illegals = [Cell.HIT, Cell.DESTROYED, Cell.MINE];
        return !this.contains(this.frame, illegals);
    },

    canItBeHIT: function(){
        // if a destroyed cell is nearby there can't be a ship-cell here
        if(this.contains(this.frame, [Cell.DESTROYED]))
            return false;

        // if hit or destroyed in diagonal it can't be a ship-cell here
        if(this.contains(this.diagonals, [Cell.HIT, Cell.DESTROYED]))
            return false;

        if(this.contains(this.straights, [Cell.HIT])){
            var hitcase = this.identifyHitCase()
            console.log('hitcase: ' + hitcase);
        }




        return true;
    },

    identifyHitCase: function(){
        var hitcase = null;

        if(this.N == Cell.HIT)
            hitcase = HitCase.NORTH;
        if(this.S == Cell.HIT)
            if(hitcase == HitCase.NORTH)
                hitcase = HitCase.VERTICAL;
            else
                hitcase = HitCase.SOUTH;

        if(this.E == Cell.HIT)
            hitcase = HitCase.EAST;
        if(this.W == Cell.HIT)
            if(hitcase == HitCase.EAST)
                hitcase = HitCase.HORIZONTAL;
            else
                hitcase = HitCase.WEST;

        return hitcase;
    },


    loadField: function(field){

    }
};

var HitCase = {
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3,
    VERTICAL: 4, // north and south
    HORIZONTAL: 5 // east and west
};
