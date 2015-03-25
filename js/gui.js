var width = 800, height = 600;

			var svgContainer = d3.select('body').append('svg')
												.attr('width', width)
												.attr('height', height)
												.attr('id', 'canvas');
			
			var fieldDim = 10;			
			
			var playfieldOffsetX = 30;
			var playfieldOffsetY = 30;	
			var strokeWidth = 0.65;
			var strokeCol = 'gray';								
			//var gridlines = [];


			var dim = 10;
			var fieldSize = 20;

			var fields = [];

			var Field = function(row, col){
				this.row = row;
				this.col = col;
				this.rect;
				this.shipFloatsAbove = function(shipColor){
					this.rect.transition().duration(10).style("fill", shipColor).style('opacity', 0.2).transition().duration(500).style("fill", "white").style('opacity', 1); //delay(100)
				}
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
            	var shrink = 6;
            	var wHoriz = fieldSize * size - shrink;
            	var hHoriz = fieldSize - shrink;
            	var wVert = hHoriz;
            	var hVert = wHoriz;
            	var self = this;
            	this.rect = svgContainer.append('rect')
										.attr('x', playfieldOffsetX + fieldSize * (column - 1) + 3)
										.attr('y', playfieldOffsetY + fieldSize * (row - 1) + 3)
										.attr('rx', 10)
										.attr('ry', 10)
										.attr('width', orientation ? wHoriz : wVert)
										.attr('height', orientation ? hHoriz : hVert)
										.attr('fill', color)
										.attr('opacity', 0.8)
										.attr('id', this.id)
										.call(drag);
				this.firstMoveDone = false;
				this.move = function(x, y){
					if(!this.firstMoveDone){
						this.oldX = this.rect.attr('x');
						this.oldY = this.rect.attr('y');
						this.firstMoveDone = true;
					}
					this.rect.attr('x', x);
			  		this.rect.attr('y', y); 
			  		var rowHead, rowTail, colHead, colTail;
			  		if(this.orientation){ //horiz
			  			rowHead = Math.round((y - playfieldOffsetY) / fieldSize + 0.75);
			  			colHead = Math.round((x - playfieldOffsetX) / fieldSize + 0.5);
			  			rowTail = rowHead;  			
			  			colTail = Math.round((x - playfieldOffsetX + wHoriz) / fieldSize + 0.5);
			  			if(rowHead <= dim && rowHead > 0 && colHead <= dim && colHead > 0){
			  				if(colHead + size <= dim + 1)
			  					for(var i = 0; i < size; i++)
			  						fields[(rowHead - 1) * dim + colHead - 1 + i].shipFloatsAbove(this.rect.attr('fill'));
			  			}
			  		} else {
			  			rowHead = Math.round((y - playfieldOffsetY) / fieldSize + 0.5);
			  			colHead = Math.round((x - playfieldOffsetX) / fieldSize + 0.75);
			  			rowTail = Math.round((y - playfieldOffsetY + hVert) / fieldSize + 0.5);
			  			colTail = colHead;
			  			if(rowHead <= dim && rowHead > 0 && colHead <= dim && colHead > 0){		  				
			  				if(rowHead + size <= dim + 1)
			  					for(var i = 0; i < size; i++)
			  						fields[(rowHead - 1) * dim + colHead - 1 + i * dim].shipFloatsAbove(this.rect.attr('fill')); 
			  			}
			  		}
				}
				this.reposition = function(){
					var x = this.rect.attr('x');
			  		var y = this.rect.attr('y'); 
			  		var rowHead, rowTail, colHead, colTail;
			  		var isOk = false;
			  		if(this.orientation){ //horiz
			  			rowHead = Math.round((y - playfieldOffsetY) / fieldSize + 0.75);
			  			colHead = Math.round((x - playfieldOffsetX) / fieldSize + 0.5);
			  			rowTail = rowHead;  			
			  			colTail = Math.round((x - playfieldOffsetX + wHoriz) / fieldSize + 0.5);
			  			if(rowHead <= dim && rowHead > 0 && colHead <= dim && colHead > 0)
			  				if(colHead + size <= dim + 1)
			  					isOk = true;
			  		} else {
			  			rowHead = Math.round((y - playfieldOffsetY) / fieldSize + 0.5);
			  			colHead = Math.round((x - playfieldOffsetX) / fieldSize + 0.75);
			  			rowTail = Math.round((y - playfieldOffsetY + hVert) / fieldSize + 0.5);
			  			colTail = colHead;
			  			if(rowHead <= dim && rowHead > 0 && colHead <= dim && colHead > 0)	  				
			  				if(rowHead + size <= dim + 1)
			  					isOk = true;
			  		}
			  		if(isOk){
			  			this.rect.attr('x', playfieldOffsetX + fieldSize * (colHead - 1) + 3);
			  			this.rect.attr('y', playfieldOffsetY + fieldSize * (rowHead - 1) + 3);
			  		} else {
			  			this.rect.attr('x', this.oldX);
			  			this.rect.attr('y', this.oldY);
			  		}
					this.firstMoveDone = false;
				}
				this.flipOrientation = function(){
					if(this.orientation){ //it was horizontal and goes now vertical
						this.rect.attr('width', wVert);
						this.rect.attr('height', hVert);
					} else {
						this.rect.attr('width', wHoriz);
						this.rect.attr('height', hHoriz);
					}
					this.orientation = !this.orientation;
				}
            	this.orientation = orientation;
            	this.fieldsDestroyed;
            	this.destroyed = false;
            }

            var battleship = new Ship(5, true, 1, 12, randomColor());
            var cruiser1 = new Ship(4, true, 2, 12, randomColor());
            var cruiser2 = new Ship(4, true, 3, 12, randomColor());
            var destroyer1 = new Ship(3, true, 4, 12, randomColor());
            var destroyer2 = new Ship(3, true, 5, 12, randomColor());
			var destroyer3 = new Ship(3, true, 6, 12, randomColor());
			var submarine1 = new Ship(2, true, 7, 12, randomColor());
			var submarine2 = new Ship(2, true, 8, 12, randomColor());
			var submarine3 = new Ship(2, true, 9, 12, randomColor());
			var submarine4 = new Ship(2, true, 10, 12, randomColor());

			function randomColor(){
				return '#' + Math.floor(Math.random() * 16777215).toString(16);
			}

			//$(document).ready(function() { });