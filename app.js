var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Human = require('./Human.js');


app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

var player0;

io.on('connection', function(socket){
	socket.emit('directmessage', 'welcome!');


    socket.on('login', function(username){
    	player0 = new Human(username);
    	player0.init(socket);
    	player0.doSetup(setupDoneCallbackFunc);
    });
});

function setupDoneCallbackFunc(player){
	console.log('TODO');
}
