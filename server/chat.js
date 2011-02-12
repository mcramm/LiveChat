state_messages = [];
var Chat = function() {
    this.state = this.buildState();

    this.http = require('http');
    this.host = 'localhost';
    this.port = 4567;

    this.loadMessages();
}

Chat.prototype.buildState = function() {
    var newState = {members: {}, messages: [], member_count: 0};
    return newState;
}

Chat.prototype.addMessage = function(conn, body) {
    var member = this.getMember( conn.id );
    var now = new Date();
    body = this.replaceUrls(body);
    body = escape( body );
    var message = {
        user_id: member.origin_id,
        message: body,
        gravatar_hash: member.gravatar_hash,
        message_time: now.getTime(),
        username: member.username
    };

    this.state.messages.push( message );

    this.saveMessage( message );

    return message;
}

Chat.prototype.addMember = function(conn, username, gravatar_hash) {
    var member = this.checkForMember(username);
    if( !member ) {
        this.state.member_count += 1;

        member = {
            origin_id: conn.id,
            id: conn.id,
            username: username,
            status: 'connected',
            gravatar_hash: gravatar_hash,
            is_new: true
        };
        this.state.members[conn.id] = member;
    } else {
        var old_id = member.id;
        var new_id = conn.id;

        member.status = 'connected';
        member.id = new_id;

        this.state.members[old_id] = null;
        this.state.members[new_id] = member;
    }

    return member;
}

Chat.prototype.getState = function(){
    return this.state;
}

Chat.prototype.replaceUrls = function(message) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return message.replace(exp,"<a target='_blank' href='$1'>$1</a>");
}

Chat.prototype.checkForMember = function(username) {
    for( var i in this.state.members ) {
        var member = this.state.members[i];
        if( member && member.username == username ) {
            return member;
        }
    }
    return null;
}

Chat.prototype.oldifyMember = function( id ) {
    this.state.members[id].is_new = false;
}

Chat.prototype.getMember = function( id ){
    return this.state.members[id];
}

Chat.prototype.saveMessage = function( message ){
    var client = this.http.createClient(this.port, this.host);
    var request = client.request('POST', '/message/save', { 'host': 'localhost'});

    console.log('saving message!!');
    var data = JSON.stringify( message );
    console.log(data);

    request.write(data);
    request.end();
}

Chat.prototype.loadMessages = function() {
    var client = this.http.createClient(this.port, this.host);
    var request = client.request('GET', '/messages', { 'host': 'localhost'});

    request.end();
    this.state = this.buildState();

    request.on('response', function(response) {
        response.on('data', function(chunk) {
            var messages = unescape( "" + chunk );
            messages = JSON.parse( messages );
            for( var i in messages ) {
                var message = JSON.parse( messages[i] );
                state_messages.push({
                    user_id: message.user_id,
                    message: message.message,
                    gravatar_hash: message.gravatar_hash,
                    message_time: message.message_time,
                    username: message.username
                });
            }
        });
    });
    this.state.messages = state_messages.sort( this.sortMessages );
}

Chat.prototype.sortMessages = function(a, b) {
    return a.message_time - b.message_time;
}


exports.Chat = Chat;
