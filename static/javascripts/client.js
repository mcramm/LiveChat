var ws = null;
$(document).ready( function() {
    ws = new WebSocket("ws://localhost:8000");

    ws.onopen = function(evt) {
        var user_data = JSON.parse($('#user-data').text());
        ws.send( JSON.stringify( 
                {   command: 'new_member',
                    username: user_data.username,
                    gravatar_hash: user_data.gravatar_hash
                }) 
        );
    }

    ws.onmessage = function(args) {
        var current_scroll_pos = $('#messages').scrollTop();
        var data = JSON.parse(args.data);

        switch( data.command ){
            case 'remove_member':
                disconnectMember( data.member_id );
                break;
            case 'reconnect_member':
                reconnectMember( data.member_id );
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

    $('#new-message').blur( function() {
        if( $('#new-message').val() == '' ) {
            deactivateTextarea();
        } else{
            $('#new-message').unbind( 'keypress' );
        }

        // race condition between keypress events
        window.setTimeout( waitForKeyPress, 1 );
    });

    $('#new-message-holder').click( function() {
        activateTextarea();
    });

    resizeWindow();

    $(window).resize( function() {
        resizeWindow();
    });

    waitForKeyPress();
});

function postMessage( message ){
    ws.send( JSON.stringify( {command: 'new_message', message: message} ) );
}
