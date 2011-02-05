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
                message = {
                    command: data.command, 
                    message: data.message, 
                    color: chat.getMemberColor( conn.id )
                }
                server.broadcast( JSON.stringify(message) );
            }
            if (data.command === 'new_member') {
                var member = chat.addMember( conn, data.username );
                server.broadcast( JSON.stringify(member) );
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
    server.broadcast( JSON.stringify( {command: 'remove_member', member_id: conn.id }));
});

// game cycle
server.listen(8000, function() {
    console.log("Server Started");
});

