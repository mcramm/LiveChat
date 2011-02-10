module UserRoutes
    get '/login' do
        haml :login
    end

    post '/signin' do
        username = params['user']['username'] 
        password = params['user']['password']
        password = md5( password )

        user = User.by_username(:key => username).first

        invalid_user if user.nil?
        invalid_password if user.password != password

        session[:user] = user

        redirect '/'
    end

    get '/register' do
        @user = User.new

        haml :register
    end

    post '/signup' do
       params['user']['password'] = md5( params['user']['password'] )
       params['user']['gravatar_hash'] = md5( params['user']['email'] )
       user = User.new( params['user'] )

       if user.save
           session[:user] = user
           redirect "/"
       else
           halt "bad user save"
       end
    end

    get '/logout' do
        verify_user
        session[:user] = nil
        redirect '/login'
    end
end
