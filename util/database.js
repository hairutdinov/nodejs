require('dotenv').config();
const mongodb = require('mongodb')
const { MongoClient, ServerApiVersion } = mongodb

let _db

const client = new MongoClient(process.env.MONGO_CONNECTION_URI)

const mongoConnect = async () => {
    // Use connect method to connect to the server
    return client.connect()
        .then(() => {
            _db = client.db()
            return client
        })
        .catch(e => {
            throw e
        })

    // const db = client.db(dbName);
    // const collection = db.collection('documents');

    // the following code examples can be pasted here...
    // return Promise.resolve(client)
}

const getDb = () => {
    if (!_db) throw 'No database found!'
     return _db
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb