require 'compass'
require 'haml'
require 'couchrest'
require 'couchrest_extended_document'

require 'lib/user'

ENV['RACK_ENV'] ||= 'production'
ENV['DB_NAME'] = 'node-chat-' << ENV['RACK_ENV']

require 'model/user'
require 'model/message'
