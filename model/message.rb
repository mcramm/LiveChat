class Message < CouchRest::ExtendedDocument
    include CouchRest::Validation

    use_database CouchRest.database!("http://127.0.0.1:5984/" << ENV['DB_NAME'])

    property :user_id
    property :message
    property :gravatar_hash
    property :message_time
    property :username

    timestamps!

    view_by :username
end
