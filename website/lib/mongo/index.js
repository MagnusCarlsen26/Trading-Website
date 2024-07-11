import mongoose from 'mongoose';

async function connectToDatabase(uri) {
    let cached = global.mongooseConnections = global.mongooseConnections || {}; 
    if (!cached[uri]) {
        cached[uri] = { conn: null, promise: null };
    }
    if (cached[uri].conn) {
        return cached[uri].conn;
    }

    if (!cached[uri].promise) {
        const opts = {
            bufferCommands: false,
        };

        cached[uri].promise = mongoose.connect(uri, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached[uri].conn = await cached[uri].promise;
    } catch (e) {
        cached[uri].promise = null;
        throw e;
    }

    return cached[uri].conn;
}

export async function authDb() {
    return connectToDatabase(process.env.MONGODB_AUTH);
}

