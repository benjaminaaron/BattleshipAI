var Human = require('./Human.js');

var player0 = new Human('Hugo');


player0.doSetup(callbackFunc);


function callbackFunc(player){
	console.log(player.name + ' is done setting up ships, it looks like this:');
	console.log(player0.field.show());
}