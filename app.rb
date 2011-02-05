require 'rubygems'
require 'sinatra'
require 'environment'
require 'digest/md5'

set :app_file, __FILE__
set :root, File.dirname(__FILE__)
set :views, "views"
set :public, "static"

enable :sessions

configure do 
    Compass.add_project_configuration(File.join(Sinatra::Application.root, 'config', 'compass.config'))
end

#before do
    #@db = CouchRest.database!("http://127.0.0.1:5984/" << ENV['DB_NAME'])
#end

get '/stylesheets/:name.css' do
    content_type 'text/css', :charset => 'utf-8'
    sass(:"stylesheets/#{params[:name]}", Compass.sass_engine_options)
end

get '/' do
    #verify_user
    #@projects = Project.all
    haml :index
end


def verify_user
    redirect '/login' if session[:user].nil?
end

private

def escape(string)
    CGI.escape string
end

def find_project(nice_url)
    nice_url = escape( nice_url )
    @project = Project.by_nice_url(:key => nice_url ).first
end

def project_url(project)
    "/project/#{project.nice_url}"
end

def issue_url(project, issue_index)
    project_url(@project) + "/issue/#{issue_index}"
end


def find_issue(project_url, issue_id)
    find_project project_url
    @issue = @project.issues[issue_id.to_i]
end

def find_comment(project_url, issue_id)
    @comments = Comment.by_issue_id(:key => "#{project_url}-#{issue_id}")
end

def destroy_comments(project_url, issue_id)
    find_comment(project_url, issue_id)

    @comments.each do |comment|
        comment.destroy
    end
end

def invalid_user 
#    session[:message] = "Invalid Username"
    redirect '/login'
end

def invalid_password 
#    session[:message] = "Invalid Password"
    redirect '/login'
end

