import clientPromise from ".";

let client
let db
let auth
let users
async function init() {
    if (db) return
    try {
        client = await clientPromise
        db = await client.db("auth")
        users = db.collection('users')
        console.log('Connectd to MongoDB')
    } catch(error) {
        console.log(error) 
        ('Failed to connect to database.')
    }
}

;(async() => {
    await init()
}) ()

export async function getUsers() {
    try {
        if (!users) await init()
        const result = await users
    .find({})
    .toArray()
    console.log(users)
    return {result}
    } catch(error) {
        console.log(error)
    }
}