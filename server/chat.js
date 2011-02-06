var Chat = function() {
    //this.members = {};
    //this.messages = [];
    this.state = this.buildState();
    this.colors = ['red', 'blue', 'orange', 'magenta', 'cyan', 'olive', 'brown', 'teal', 'green', 'gray'];
}

Chat.prototype.buildState = function() {
    var newState = {members: {}, messages: [], member_count: 0};
    return newState;
}

Chat.prototype.addMessage = function(conn, message) {
    var member = this.getMember( conn.id );
    var message = {
        user_id: conn.id,
        message: this.replaceUrls(message),
        color: member.color,
        gravatar_hash: member.gravatar_hash
    };

    this.state.messages.push( message );

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
            is_new: true,
            color: this.colors.shift()
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

Chat.prototype.getMemberColor = function(id) {
    return this.state.members[id].color;
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

exports.Chat = Chat;
