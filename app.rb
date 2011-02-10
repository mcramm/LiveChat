require 'rubygems'
require 'sinatra'
require 'environment'
require 'digest/md5'

set :app_file, __FILE__
set :root, File.dirname(__FILE__)
set :views, "views"
set :public, "static"
set :bind, "localhost"
set :port, "4567"

enable :sessions

configure do
    Compass.add_project_configuration(File.join(Sinatra::Application.root, 'config', 'compass.config'))
end

before do
    @db = CouchRest.database!("http://127.0.0.1:5984/" << ENV['DB_NAME'])
end

get '/stylesheets/:name.css' do
    content_type 'text/css', :charset => 'utf-8'
    sass(:"stylesheets/#{params[:name]}", Compass.sass_engine_options)
end

get '/' do
    verify_user
    haml :index
end

get '/messages' do
    messages = Message.all
    return "[]" if messages.size <= 0

    json = "["

    messages.reverse.each do |message|
        json = "{\"user_id\": #{message.user_id},\"message\": \"#{message.message}\",\"gravatar_hash\": \"#{message.gravatar_hash}\",\"username\": \"#{message.username}\",\"message_time\": #{message.message_time}},"
        return_messages << json
    end
    return_messages.chop!
    return_messages << "]"

    return return_messages
end

post '/message/save' do
    message_data = JSON.parse( params.to_s )

    message = Message.new(message_data)
    message.save
end

def verify_user
    redirect '/login' if session[:user].nil?
end

private

def escape(string)
    CGI.escape string
end

def invalid_user
    redirect '/login'
end

def invalid_password
    redirect '/login'
end

def md5(string)
    return Digest::MD5.hexdigest(string)
end
