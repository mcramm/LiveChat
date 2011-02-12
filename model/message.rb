class Message < CouchRest::ExtendedDocument
    include CouchRest::Validation

    use_database CouchRest.database!("http://127.0.0.1:5984/" << ENV['DB_NAME'])

    property :json_string

    timestamps!

    view_by :username
end
