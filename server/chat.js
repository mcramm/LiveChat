var Chat = function() {
    //this.members = {};
    //this.messages = [];
    this.state = this.buildState();
    this.colors = [
        'red',
        'blue',
        'green'
    ]
}

Chat.prototype.buildState = function() {
    var newState = {members: {}, messages: [], member_count: 0};
    return newState;
}

Chat.prototype.addMessage = function(conn, message) {
    var message = {
        user_id: conn.id,
        message: message,
        color: this.getMemberColor( conn.id )
    };

    this.state.messages.push( message );

    return message;
}

Chat.prototype.addMember = function(conn, username) {
    this.state.member_count += 1;

    var member = {
        id: conn.id,
        username: username, 
        status: 'connected',
        color: this.colors.shift()
    };
    this.state.members[conn.id] = member;

    return member;
}

Chat.prototype.getMemberColor = function(id) {
    return this.state.members[id].color;
}

Chat.prototype.getState = function(){
    return this.state;
}

exports.Chat = Chat;
