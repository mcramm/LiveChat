module UserRoutes
    get '/login' do
        haml :login
    end

    post '/signin' do
        username = params['user']['username'] 
        password = params['user']['password']
        password = Digest::MD5.hexdigest( password )

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
       params['user']['password'] = Digest::MD5.hexdigest( params['user']['password'] )
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
