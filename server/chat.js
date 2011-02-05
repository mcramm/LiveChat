var Chat = function() {
    this.responses = {};
    this.state = this.buildState();
}

Chat.prototype.buildState = function() {
    var newState = {memebers: {}, member_count: 0};
    return newState;
}

Chat.prototype.addMember = function(conn, username) {
    this.state.member_count += 1;

    var member = {username: username, status: 'connected'};

    //this.state.members[conn.id] = member;
}

Chat.prototype.removeMember = function(conn) {
    var member = this.state.members[conn.id];
    if( member ) {
        this.state.players[conn.id].status = 'disconnected';
    }
}

exports.Chat = Chat;
