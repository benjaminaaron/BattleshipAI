var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Game = require('./game/Game.js');
var Human = require('./game/Human.js');


app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

var player0, player1, game;

io.on('connection', function(socket){
	socket.emit('directmessage', 'welcome!');

    socket.on('login', function(username){
    	if(!player0){
    		console.log('human ' + username + ' logged in');
	    	player0 = new Human(username);
	    	player0.init(socket);
	    	socket.emit('directmessage', 'waiting for the 2nd player to connect');
    	}
    	else {
    		console.log('human ' + username + ' logged in');
    		player1 = new Human(username);
	    	player1.init(socket);

	    	game = new Game(io, player0, player1);
	    	game.start();
    	}
    });
});
