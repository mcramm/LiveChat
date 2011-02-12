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

    return_messages = "["

    messages.reverse.each do |message|
        return_messages << message.json_string << ","
    end
    return_messages.chop!
    return_messages << "]"

    puts "RETURN MESSAGES"
    puts
    puts return_messages

    return return_messages
end

post '/message/save' do
    json_string = params.keys.first.split("\n")[1].strip.dump

    message = Message.new({:json_string => json_string})
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
