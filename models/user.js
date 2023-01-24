const { ObjectId } = require('mongodb')
const { getDb } = require('../util/database')

class User {
    constructor(username, email) {
        this.username = username
        this.email = email
    }

    save() {
        const db = getDb()
        return db.collection('products').insertOne(this)
            .then(r => {
                console.log(r)
                return Promise.resolve(r)
            })
            .catch(e => {
                console.error(e)
                throw e
            })
    }

    static findById(id) {
        const db = getDb()
        return db.collection('users')
            .findOne({ _id: new ObjectId(id) })
            .then(u => u)
            .catch(console.error)
    }
}
module.exports = User