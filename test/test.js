//require("sinon-nodeunit");
var Chat = require("../server/chat").Chat;
Chat.prototype.loadMessages = function() {};
Chat.prototype.saveMessage = function() {};

var conn = {id: 123};

exports.testBuildState = function(test) {
    var chat = new Chat();

    test.expect(5);

    test.notStrictEqual( chat.state.members, undefined, "chat.state.members is undefined.");
    test.notStrictEqual( chat.state.messages, undefined, "chat.state.messages is undefined.");
    test.notStrictEqual( chat.state.member_count, undefined, "chat.state.member_count is undefined.");

    test.strictEqual(  chat.state.messages.length, 0,
            "the chat.state.messages array isn't empty.");
    test.strictEqual( chat.state.member_count, 0, "the chat.state.member_count isn't 0 (zero).");

    test.done();
};

exports.testAddMember = function(test) {
    var chat = new Chat();
    var username = 'mike';
    var gravatar_hash = 'asdf12356JKHHG';
    chat.addMember(conn, username, gravatar_hash);

    test.expect(6);
    test.notStrictEqual( chat.state.members.length, 0, "No member was added." );

    var member = chat.state.members[conn.id];
    test.equal( member.username, username, "member username" + member.username + " does not match " + username + "." );
    test.equal( member.gravatar_hash, gravatar_hash, "gravatar_hash" + member.gravatar_hash + " does not match " + gravatar_hash + "." );
    test.equal( member.id, conn.id, "member id: " + member.id + " does not match " + conn.id + "." );
    test.equal( member.origin_id, conn.id, "member origin id " + member.origin_id + " does not match " + conn.id + "." );
    test.ok( member.is_new, "member isn't new." );

    test.done();
}

exports.testOldifyMember = function(test) {
    var chat = new Chat();
    var username = 'mike';
    var gravatar_hash = 'asdf12356JKHHG';
    chat.addMember(conn, username, gravatar_hash);

    var member = chat.state.members[conn.id];
    chat.oldifyMember(member.id);

    test.expect(1);

    test.strictEqual( member.is_new, false, "member is not new." );

    test.done();
}

exports.testAddDisconnectAdd = function(test) {
    var chat = new Chat();
    var username = 'mike';
    var gravatar_hash = 'asdf12356JKHHG';
    chat.addMember(conn, username, gravatar_hash);
    var conn2 = {id: 456};
    chat.addMember(conn2, username, gravatar_hash);

    test.expect(4);

    var old_member = chat.state.members[conn.id];
    test.strictEqual( old_member, null, "Old member isn't null." );

    var new_member = chat.state.members[conn2.id];
    test.notStrictEqual( new_member, null, "New member is null." );
    test.equal( new_member.id, conn2.id, "New member id does not equal the new connection id." );
    test.equal( new_member.origin_id, conn.id, "New member origin id does not equal the original connection id." );

    test.done();
}

exports.testReplaceUrls = function(test) {
    var chat = new Chat();
    var body1 = "First Message Body";
    var body2 = "Second Message Body With Link: http://www.google.ca";

    var subbed_body1 = 'First%20Message%20Body';
    var subbed_body2 = 'Second%20Message%20Body%20With%20Link%3A%20%3Ca%20target%3D%27_blank%27%20href%3D%27http%3A//www.google.ca%27%3Ehttp%3A//www.google.ca%3C/a%3E';

    var new_message1 = chat.replaceUrlsAndEscape(body1);
    var new_message2 = chat.replaceUrlsAndEscape(body2);
    test.expect(4);

    test.notEqual(body1, new_message1, "body1 matches new_message1.");
    test.notEqual(body2, new_message2, "body2 matches new_message2.");
    test.equal(subbed_body1, new_message1, "subbed_body1 does not match new_message1.");
    test.equal(subbed_body2, new_message2, "subbed_body2 does not match new_message2.");

    test.done();
}

exports.testAddMessage = function(test) {
    var chat = new Chat();
    var username = 'mike';
    var gravatar_hash = 'asdf12356JKHHG';

    var body1 = "First Message Body";
    var body2 = "Second Message Body With Link: http://www.google.ca";

    var match_body1 = chat.replaceUrlsAndEscape("First Message Body");
    var match_body2 = chat.replaceUrlsAndEscape("Second Message Body With Link: http://www.google.ca");

    chat.addMember(conn, username, gravatar_hash);
    chat.addMessage(conn, body1);

    test.expect(12);

    var message = chat.state.messages[0];
    test.notStrictEqual(message, null , "body1 is null");
    test.equal(message.message, match_body1, "body1: "+match_body1+" does not match "+message.message);
    test.equal(message.user_id, conn.id, "body1,user_id: "+conn.id+" does not match "+message.user_id);
    test.equal(message.username, username, "body1,username: "+username+" does not match "+message.username);
    test.equal(message.gravatar_hash, gravatar_hash, "body1,gravatar: "+gravatar_hash+" does not match "+message.gravatar_hash);
    test.ok(message.message_time > 0, "body1,message_time isn't greater than 0 (zero).");

    chat.addMessage(conn, body2);
    message = chat.state.messages[0];
    test.notStrictEqual(message, null , "body2 is null");
    test.equal(message.message, match_body1, "body2: "+match_body2+" does not match "+message.message);
    test.equal(message.user_id, conn.id, "body2,user_id: "+conn.id+" does not match "+message.user_id);
    test.equal(message.username, username, "body2,username: "+username+" does not match "+message.username);
    test.equal(message.gravatar_hash, gravatar_hash, "body2,gravatar: "+gravatar_hash+" does not match "+message.gravatar_hash);
    test.ok(message.message_time > 0, "body2,message_time isn't greater than 0 (zero).");

    test.done();
}
