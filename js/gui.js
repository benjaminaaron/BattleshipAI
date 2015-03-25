
var width = 800, height = 600;

var svgContainer = d3.select('body').append('svg')
									.attr('width', width)
									.attr('height', height)
									.attr('id', 'canvas');
					
var playfieldOffsetX = 30;
var playfieldOffsetY = 30;	
var strokeWidth = 0.65;
var strokeCol = 'gray';								
//var gridlines = [];

var dim = 10;
var fieldSize = 20;

//frame around the playfield
svgContainer.append('rect')
			.attr('x', playfieldOffsetX)
			.attr('y', playfieldOffsetY)
			.attr('width', fieldSize * dim)
			.attr('height', fieldSize * dim)
			.attr('fill', 'none')
			.attr('stroke', 'black')
			.attr('stroke-width', '2');

var shrink = 6; //makes ships a bit smaller than the grid-rectangles, looks nicer
var shipRoundRect = 10; //gives the rectangles of the shops rounded corners, 0 would be not rounded

var fields = [];

var Field = function(row, col){
	this.row = row;
	this.col = col;
	this.rect;
	this.shipFloatsAbove = function(shipColor){
		this.rect.transition().duration(10).style("fill", shipColor).style('opacity', 0.2).transition().duration(500).style("fill", "white").style('opacity', 1); //delay(100)
	}
	this.isOccupiedBy = null;
}

var inDragging = false; // to detect the moment when dragging starts

function checkShipPlacement(x, y, reposition, ship){ //put==false means the ship is being dragged instead of the mouse having been released	
	if(!inDragging){
		removeOccupations(ship);
		inDragging = true;
	}

	ship.rect.attr('x', x);
	ship.rect.attr('y', y); 

	var rowHead, colHead, rowTail, colTail;
	var fieldsUnderBoat = [];

	if(ship.orientation){ // ship is horizontal
		rowHead = Math.round((y - playfieldOffsetY) / fieldSize + 0.75);
		colHead = Math.round((x - playfieldOffsetX) / fieldSize + 0.5);
		rowTail = rowHead;  			
		colTail = Math.round((x - playfieldOffsetX + ship.wHoriz) / fieldSize + 0.5);
	} else { // ship is vertical
		rowHead = Math.round((y - playfieldOffsetY) / fieldSize + 0.5);
		colHead = Math.round((x - playfieldOffsetX) / fieldSize + 0.75);
		rowTail = Math.round((y - playfieldOffsetY + ship.hVert) / fieldSize + 0.5);
		colTail = colHead;
	}	
	//console.log(rowHead + '  |  ' + colHead + '  |  ' + rowTail + '  |  ' + colTail);

	var isOnPlayfield = checkIsOnPlayfield(rowHead, colHead, rowTail, colTail, ship.size, ship.orientation ? colHead : rowHead);
	if(isOnPlayfield)
		for(var i = 0; i < ship.size; i++)
		  	ship.orientation ? fieldsUnderBoat.push(getField(rowHead, colHead + i)) : fieldsUnderBoat.push(getField(rowHead + i, colHead));

	var isOverlapping = checkIsOverlapping(fieldsUnderBoat);
	if(!isOverlapping && isOnPlayfield){	
		fieldGroupAction(fieldsUnderBoat, reposition, ship);
	}

	if(reposition && (!isOnPlayfield || isOverlapping)){ // snap back into the pos it was in before dragging
		if(ship.oldOrientation != ship.orientation)
			ship.flipOrientation();
		if(ship.wasNeverPlaced){
			ship.rect.attr('x', ship.startX);
			ship.rect.attr('y', ship.startY);
		} else
			checkShipPlacement(ship.oldX, ship.oldY, true, ship);
	}
}

function removeOccupations(ship){
	if(ship.fieldsOccupied.length > 0){ // that would mean it was placed before
		for(var i=0; i < ship.fieldsOccupied.length; i++)
			ship.fieldsOccupied[i].isOccupiedBy = null;
		ship.fieldsOccupied = [];
	}
}

function checkIsOverlapping(fieldGroup){
	var overlapDetected = false;
	for(var i=0; i < fieldGroup.length; i++)
		if(fieldGroup[i].isOccupiedBy != null)
			overlapDetected = true;
	return overlapDetected;
}

function checkIsOnPlayfield(rowHead, colHead, rowTail, colTail, shipSize, colOrRowHead){
	return (rowHead <= dim && rowHead > 0 && colHead <= dim && colHead > 0) && (colOrRowHead + shipSize <= dim + 1);
}

function fieldGroupAction(fieldGroup, reposition, ship){
	if(reposition){
		ship.rect.attr('x', playfieldOffsetX + fieldSize * (fieldGroup[0].col - 1) + shrink / 2);
		ship.rect.attr('y', playfieldOffsetY + fieldSize * (fieldGroup[0].row - 1) + shrink / 2);
		ship.fieldsOccupied = fieldGroup;
		for(var i=0; i < fieldGroup.length; i++){
			fieldGroup[i].isOccupiedBy = ship; //console.log('field ' + fieldGroup[i].row + '/' + fieldGroup[i].col + '  is occubied by ' + ship);
		}
		inDragging = false;
		ship.wasNeverPlaced = false;
	} else {
		for(var i=0; i < fieldGroup.length; i++)
			fieldGroup[i].shipFloatsAbove(ship.color);
	}
}

function getField(row, col){
	return fields[(row - 1) * dim + col - 1]; //TODO verify
}

for(var i = 1; i <= dim; i++) // fill the fields array with 10x10=100 fields
	for(var j = 1; j <= dim; j++)
		fields.push(new Field(i,j));

for(var i = 0; i < fields.length; i++) //attache the rect-element to every field
	fields[i].rect = svgContainer.append('rect')
					.attr('x', playfieldOffsetX - fieldSize + fields[i].col * fieldSize)
					.attr('y', playfieldOffsetY - fieldSize + fields[i].row * fieldSize)
					.attr('width', fieldSize)
					.attr('height', fieldSize)
					.attr('fill', 'white')
					.attr('stroke', 'silver')
					.attr('stroke-width', '1');
for(var i = 0; i < dim; i++){ //place the x and y labels
	svgContainer.append('text')
				.attr('x', playfieldOffsetX - 18)
				.attr('y', i * fieldSize + playfieldOffsetY + 14)
				.attr('font-family', 'arial')
				.attr('font-size', '11px')
				.attr('fill', 'gray')
				.text(i + 1);
	svgContainer.append('text')
				.attr('x', playfieldOffsetX + i * fieldSize + 7)
				.attr('y', playfieldOffsetY - 10)
				.attr('font-family', 'arial')
				.attr('font-size', '11px')
				.attr('fill', 'gray')
				.text(String.fromCharCode('A'.charCodeAt() + i));
}

var draggedShip = null;
var drag = d3.behavior.drag().on("drag", dragmove);
drag.on("dragstart", function() {
	draggedShip = ships[d3.select(this).attr('id')];
});
drag.on("dragend", function() {
	draggedShip.reposition();
	draggedShip = null;
});
function dragmove(){
	var x = d3.event.x;
  	var y = d3.event.y;
  	draggedShip.move(x, y);
}

var oneFlipAllowed = true;
$('body').on('keydown keyup', function(e){		
	if(e.type == 'keydown' && e.shiftKey && draggedShip != null && oneFlipAllowed){
		draggedShip.flipOrientation();
		oneFlipAllowed = false;
	}
	if(e.type == 'keyup')
		oneFlipAllowed = true;
})
			     
var ships = [];

var Ship = function(size, orientation, row, column, color){ //true is horizontal, false is vertical
   	this.id = ships.length;
   	ships.push(this);
   	this.size = size;
   	this.color = color;
   	this.startX = playfieldOffsetX + fieldSize * (column - 1) + shrink / 2;
   	this.startY = playfieldOffsetY + fieldSize * (row - 1) + shrink / 2;
    this.wHoriz = fieldSize * size - shrink;
    this.hHoriz = fieldSize - shrink;
    this.wVert = this.hHoriz;
    this.hVert = this.wHoriz;
    this.orientation = orientation;
    this.oldOrientation = orientation;
    //this.fieldsDestroyed;
    //this.destroyed = false;
    this.fieldsOccupied = [];
    this.wasNeverPlaced = true;
    this.rect = svgContainer.append('rect')
							.attr('x', this.startX)
							.attr('y', this.startY)
							.attr('rx', shipRoundRect)
							.attr('ry', shipRoundRect)
							.attr('width', orientation ? this.wHoriz : this.wVert)
							.attr('height', orientation ? this.hHoriz : this.hVert)
							.attr('fill', color)
							.attr('opacity', 0.8)
							.attr('id', this.id)
							.call(drag);
	this.mouseHeadDiffX = 0;
	this.mouseHeadDiffY = 0;
	this.move = function(x, y){
		if(!inDragging){ //ensures that the old coords are only saved once at (before) the very first movement is applied
			this.oldX = this.rect.attr('x');
			this.oldY = this.rect.attr('y');
			this.oldOrientation = this.orientation;
			this.mouseHeadDiffX = this.oldX - x;
			this.mouseHeadDiffY = this.oldY - y;
		}
		x = x + this.mouseHeadDiffX;
		y = y + this.mouseHeadDiffY;
		checkShipPlacement(x, y, false, this);
	}
	this.reposition = function(){	
		checkShipPlacement(this.rect.attr('x'), this.rect.attr('y'), true, this);
	}
	this.flipOrientation = function(){
		if(this.orientation){ //it was horizontal and goes now vertical
			this.rect.attr('width', this.wVert);
			this.rect.attr('height', this.hVert);
		} else {
			this.rect.attr('width', this.wHoriz);
			this.rect.attr('height', this.hHoriz);
		}
		this.orientation = !this.orientation;
	}
	this.toString = function(){
		var fieldsOccupiedStr = 'not placed yet';
		if(this.fieldsOccupied.length > 0){
			fieldsOccupiedStr = '';
			for(var i=0; i < this.fieldsOccupied.length; i++)
				fieldsOccupiedStr = fieldsOccupiedStr + '(' + this.fieldsOccupied[i].row + ',' + this.fieldsOccupied[i].col + ')';
		}
		return '[' + this.size + ' ' + (this.orientation ? 'horizontal' : 'vertical') + ': ' + fieldsOccupiedStr + ']';
	}
}

var battleshipColor = 'navy';
var battleship = new Ship(5, true, 1, 12, battleshipColor);
var cruiserColor = 'maroon';
var cruiser1 = new Ship(4, true, 2, 12, cruiserColor);
var cruiser2 = new Ship(4, true, 3, 12, cruiserColor);
var destroyerColor = 'lime';
var destroyer1 = new Ship(3, false, 4, 12, destroyerColor);
var destroyer2 = new Ship(3, false, 4, 13, destroyerColor);
var destroyer3 = new Ship(3, false, 4, 14, destroyerColor);
var submarineColor = 'orange';
var submarine1 = new Ship(2, true, 7, 12, submarineColor);
var submarine2 = new Ship(2, true, 8, 12, submarineColor);
var submarine3 = new Ship(2, true, 7, 14, submarineColor);
var submarine4 = new Ship(2, true, 8, 14, submarineColor);

/*
function randomColor(){
	return '#' + Math.floor(Math.random() * 16777215).toString(16);
}*/
