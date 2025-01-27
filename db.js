const {MongoClient} = require('mongodb');
const uri = "mongodb://localhost:27017/mydatabase"
let db = null;

function createDatabaseTable() {
    const collection = db.collection("Users")
    collection.drop()
    db.createCollection("Users").then(result => {
    })
}

async function connectDB() {
    const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

    try {
        await client.connect();
        db = client.db();
        console.log("Connected to MongoDB");
        createDatabaseTable()
    } catch (err) {
        console.error("Could not connect to MongoDB", err);
    }
}

function checkUsersExistence(email) {
   return  db.collection('Users').findOne({email: email}).then(result => {
        return result !== null;
    })
}

async function createUser(email, fname, lname) {
    try {
        const doesUserExist = await Promise.resolve(checkUsersExistence(email))
        if (!doesUserExist) {
            db.collection("Users").insertOne({
                "email": email,
                "fname": fname,
                "lname": lname
            })
            return true
        } else {
            return true
        }
    }catch(error) {
        return false
    }
}
module.exports = {connectDB, createUser}
