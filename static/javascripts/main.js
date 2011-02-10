var textarea_active = false;

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
    $('#new-message-holder').html( "<span class='click-to-start'>Click or start typing</span>" );

    $('#new-message').unbind( 'keypress' );
}

function appendMessage( message ){
    var message_node = "<div class='message'>\
        <div class='message-top'>\
            <img width='25px' class='member-img' src='http://www.gravatar.com/avatar/"+message.gravatar_hash+"' />\
            <span class='meta user'>"+ message.username +"</span>\
            <span class='meta date'>"+ getDateString(message.message_time) +"</span>\
        </div>\
    <div class='message-body'>" + unescape( message.message ) + "</div>\
    </div>";

    $('#messages').append( message_node );
    $('#messages').scrollTop(9999999);

    $('#members>.' + message.username + '>.meta>#last-message').html(unescape( message.message ));
}

function appendMember( member ){
    var memberDiv = "<div id="+member.origin_id+" class='player " + member.username + " " + member.status + "'>\
    <img width='25px' class='member-img' src='http://www.gravatar.com/avatar/"+member.gravatar_hash+"' />\
    <div class='meta'>\
        <span class='user'>" + member.username + "</span><span id='last-message'></span>\
    </div>\
    </div>";

    $('#members').append(memberDiv);
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
