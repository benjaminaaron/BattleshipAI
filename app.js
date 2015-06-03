var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

io.on('connection', function(socket){
	console.log('user connected: ' + socket.id);

	socket.emit('directmessage', 'welcome!');

    socket.on('reply', function(msg){
    	console.log(msg);
    });

	socket.on('disconnect', function(){
		console.log('user disconnected: ' + socket.id);
	});
});
