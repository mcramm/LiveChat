LiveChat
==========

Another group chat with [Node.js](http://nodejs.org/). This one runs on top of a [Sinatra](http://www.sinatrarb.com/) app that handles users/registration, etc, through (CouchDB)[http://couchdb.apache.org/].


Installing
----------

First, install [Node.js](http://nodejs.org/)

Next, clone this repo:
    git clone https://github.com/mcrmm/LiveChat.git live-chat

Load the node-websocket-server submodule:
    git submodule update --init --recursive

Install bunlder and install any necessary gems:
    gem install bundler
    bundle install

Compile the .sass files to .css by running:
    compass

You will also need to install CouchDB. If you're on Mac, you can use the awesome (CouchDBX)[http://janl.github.com/couchdbx/]. If you're on/want something else then you're on your own! You should be able to find proper instructions at [http://couchdb.apache.org/](http://couchdb.apache.org/).

Configuring
-----------

You can adjust the hostname/port of the Nodejs server by modifying the file at:
    static/javascripts/client.js

You can adjust the hostname/port of the rack server by setting the bind/port attributes in:
    app.rb


Using
-----------

Start the Node server:
    node server/server.js

Lanuch Sinatra:
    ruby app.rb

You will also need to start CouchDB.

In your browser enter the hostname/port you configured previously (by default it will be localhost:4567).

You won't have a user account, so you'll need to register & login. Once you hit the index page, start typing and you're off!
