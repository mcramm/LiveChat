var ws = null
$(document).ready( function() {
    ws = new WebSocket("ws://localhost:8000");
    ws.onopen = function(evt) {
        console.log('Connected');
        ws.send( JSON.stringify( {command: 'new_member', username: "mike"} ) );
        ws.send( JSON.stringify( {command: 'new_message', message: "Hello!"} ) );
    }
    ws.onmessage = function(args) {
        console.log('got message!', args);
        var data = JSON.parse(args.data);

        if( data.message ){
            appendMessage( data );
        }

        if( data.username ) {
            appendMember( data.username );
        }
    }

    $('#new-message').focus( function() {
        console.log('focused!');

        $('#new-message').keypress( function(e) {
            if( e.keyCode == 13 ) {
                console.log('enter pressed!');
                console.log( $('#new-message').val() );

                postMessage( $('#new-message').val() );
                $('#new-message').blur();
            }
        });
    });
    $('#new-message').blur( function() {
        console.log('blured!');

        $('#new-message').unbind( 'keypress' );
    });
});

function appendMessage( data ){
    $('#messages').append("<div class='message'>" + data.message + "</div>");
}

function appendMember( username ){
    $('#members').append("<div class='player " + username + "'>" + username + "</div>");
}

function postMessage( message ){
    console.log('postMessage called!', message);
    ws.send( JSON.stringify( {command: 'new_message', message: message} ) );
}

