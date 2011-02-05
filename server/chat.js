var Chat = function() {
    this.members = {};
    this.state = this.buildState();
    this.colors = [
        'red',
        'blue',
        'green'
    ]
}

Chat.prototype.buildState = function() {
    var newState = {memebers: {}, member_count: 0};
    return newState;
}

Chat.prototype.addMember = function(conn, username) {
    this.state.member_count += 1;

    var member = {
        id: conn.id,
        username: username, 
        status: 'connected',
        color: this.colors.shift()
    };
    this.members[conn.id] = member;

    return member;
}

Chat.prototype.getMemberColor = function(id) {
    return this.members[id].color;
}

exports.Chat = Chat;
