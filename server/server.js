var sys = require("util")
  , ws = require('./node-websocket-server/lib/ws/server');

var Chat = require('./chat').Chat
var chat = new Chat();

var server = ws.createServer({debug: false});


// Handle WebSocket Requests
server.addListener("connection", function(conn){

    conn.addListener("message", function(msg){
        try{
            var data = JSON.parse(msg);
            if (data.command === 'new_message') {
                console.log( 'new message!', msg);
                server.broadcast( msg );
            }
            if (data.command === 'new_member') {
                chat.addMember( conn, data.username );
                server.broadcast( msg );
            }
        } catch(e) {
            console.warn(e + 'dropping command for ' + conn.id + ' command: ' + msg);
        }
    });
});

server.addListener("error", function(){
  console.log(Array.prototype.join.call(arguments, ", "));
});

server.addListener("disconnect", function(conn){
  console.log('disconnect');
  //game.removePlayer(conn);
});

// game cycle
server.listen(8000, function() {
    console.log("Server Started");
});

