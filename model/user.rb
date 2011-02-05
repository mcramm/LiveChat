class User < CouchRest::ExtendedDocument
    include CouchRest::Validation

    use_database CouchRest.database!("http://127.0.0.1:5984/" << ENV['DB_NAME'])

    property :username
    property :password
    property :email

    timestamps!

    validates_presence_of :username
    validates_presence_of :password
    validates_presence_of :email

    view_by :username
end
