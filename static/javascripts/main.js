var ws = null
var textarea_active = false;
$(document).ready( function() {
    ws = new WebSocket("ws://localhost:8000");
    ws.onopen = function(evt) {
        var user_data = JSON.parse($('#user-data').text());
        ws.send( JSON.stringify( {command: 'new_member', username: user_data.username, gravatar_hash: user_data.gravatar_hash} ) );
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

function resizeWindow() {
    $('#messages').css('max-height', window.innerHeight - 70 );
    $('#messages').scrollTop(9999999);
}
function waitForKeyPress() {
    $('body').keypress( function(e) {
        activateTextarea();
    });
}

function activateTextarea() {
    if( !textarea_active ){
        $('#new-message-holder').html( $('#new-message') );
    }
    textarea_active = true;
    $('#new-message').focus();

    $('body').unbind( 'keypress' );

    $('#new-message').keypress( function(e) {
        if( e.keyCode == 13 ) {
            var node = $('#new-message');

            postMessage( node.val() );
            deactivateTextarea();

            $('#new-message').blur();
        }
    });
}

function deactivateTextarea() {
    textarea_active = false;
    $('#new-message').val('');

    $('#new-message').appendTo( '#inactive-message-holder' );
    $('#new-message-holder').html( "<span class='click-to-start'>Click or start typeing</span>" );

    $('#new-message').unbind( 'keypress' );
}

function appendMessage( message ){

    var message_node = "<div class='message "+ message.color +"'>";
        message_node += "<div class='message-top'>";
            message_node += "<img width='25px' class='member-img' src='http://www.gravatar.com/avatar/"+message.gravatar_hash+"' />";
            message_node += "<span class='meta user'>"+ message.username +"</span>";
            message_node += "<span class='meta date'>"+ getDateString(message.message_time) +"</span>";
        message_node += "</div>"; 
    message_node += "<div class='message-body'>" + message.message + "</div>";
    message_node += "</div>";
    $('#messages').append( message_node );
    $('#messages').scrollTop(9999999);

    $('#members>.' + message.username + '>.meta>#last-message').html(message.message);

}

function appendMember( member ){
    var memberDiv = "<div id="+member.origin_id+" class='player " + member.username + " " + member.status + "'>";
    memberDiv += "<img width='25px' class='member-img' src='http://www.gravatar.com/avatar/"+member.gravatar_hash+"' />";
    memberDiv += "<div class='meta'>";
        memberDiv +="<span class='user'>" + member.username + "</span><span id='last-message'></span>";
    memberDiv += "</div></div>";
    $('#members').append(memberDiv);
}

function postMessage( message ){
    ws.send( JSON.stringify( {command: 'new_message', message: message} ) );
}

function getDateString( time ){
    var the_date = new Date(time);
    var date_str = padDate( the_date.getMonth() + 1 ) + "-" + padDate( the_date.getDate() ) + "-" + the_date.getFullYear();
    date_str += " " + padDate( the_date.getHours() ) + ":" + padDate( the_date.getMinutes() ) + ":" + padDate( the_date.getSeconds() );

    return date_str;
}

function padDate(num) {
    var padded = "" + num;
    if( padded.length < 2 ){
        padded = "0" + padded;
    }
    return padded;
}


function disconnectMember( id ) {
    $("#" + id).removeClass( 'connected' );
    $("#" + id).addClass( 'disconnected' );
}

function reconnectMember( id ) {
    $("#" + id).removeClass( 'disconnected' );
    $("#" + id).addClass( 'connected' );
}

function init( state ){
    $.each( state.members , function(id, member) {
        if(member) {
            appendMember( member );
        }
    });
    $.each( state.messages , function(index, message) {
        if(message) {
            appendMessage( message );
        }
    });
}
