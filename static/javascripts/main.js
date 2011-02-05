var ws = null
$(document).ready( function() {
    ws = new WebSocket("ws://localhost:8000");
    ws.onopen = function(evt) {
        var user_data = JSON.parse($('#user-data').text());

        ws.send( JSON.stringify( {command: 'new_member', username: user_data.username, gravatar_hash: user_data.gravatar_hash} ) );
        ws.send( JSON.stringify( {command: 'new_message', message: "Hello!"} ) );
    }
    ws.onmessage = function(args) {
        console.log('got message!', args);
        var data = JSON.parse(args.data);

        switch( data.command ){
            case 'remove_member':
                disconnectMember( data.member_id );
                break;
            case 'new_message':
                appendMessage( data.message );
                break;
            case 'new_member':
                appendMember( data.member );
                break;
            case 'init':
                init( data.state );
                break;
        }
    }

    $('#new-message').focus( function() {
        console.log('focused!');

        $('#new-message').val('');
        $('#new-message').keypress( function(e) {
            if( e.keyCode == 13 ) {
                var node = $('#new-message');
                console.log('enter pressed!');
                console.log( node.val() );

                postMessage( node.val() );
            }
        });
    });

    $('#new-message').blur( function() {
        console.log('blured!');
        $('#new-message').unbind( 'keypress' );
    });
});

function appendMessage( message ){
    console.log('new message!!', message);
    $('#messages').append("<div class='message "+ message.color +"'>" + message.message + "</div>");
}

function appendMember( member ){
    console.log('new memeber!', member);
    var memberDiv = "<div id="+member.id+" class='player " + member.color + " " + member.status + "'><img width='25px' class='member-img' src='http://www.gravatar.com/avatar/"+member.gravatar_hash+"' />" + member.username + "</div>";
    $('#members').append(memberDiv);
}

function postMessage( message ){
    console.log('postMessage called!', message);
    ws.send( JSON.stringify( {command: 'new_message', message: message} ) );
}

function disconnectMember( id ) {
    $("#" + id).removeClass( 'connected' );
    $("#" + id).addClass( 'disconnected' );
}

function init( state ){
    console.log('initilizing!!')

    $.each( state.members , function(id, member) {
        console.log('    initing member', member);
        appendMember( member );
    });
    $.each( state.messages , function(index, message) {
        console.log('    initing message', message);
        appendMessage( message );
    });
}
