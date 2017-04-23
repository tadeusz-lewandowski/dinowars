var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Game = require("./modules/game.js");


app.use(express.static('assets'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});


game = new Game();

// send updated data to every player
setInterval(function() {
    io.emit("players list", game.players);
}, 1);

io.on('connection', function(socket){
    console.log('a user connected');

    var player = game.generatePlayer(socket.id);
    game.addPlayer(player);

    socket.emit("send id", player.id);

    socket.on('disconnect', function(){
        console.log('user disconnected');
        game.removePlayer(socket.id);
    });

    socket.on('move player', function(player){
        game.movePlayer(player);
        // io.emit("players list", game.players);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
