import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable in .env.local"
    );
}

/**
 * Shape of the cached connection object stored on the global object.
 * - `conn`: the active Mongoose instance (null until first connection).
 * - `promise`: the in-flight connection promise (null when not connecting).
 *
 * Caching both lets us reuse an established connection AND avoid
 * creating duplicate promises when multiple requests arrive while the
 * initial connection is still being established.
 */
interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

/**
 * Extend the Node.js `global` type so TypeScript knows about our cache.
 * Using `global` (rather than module-level state) ensures the value
 * survives Next.js hot-module replacement during development.
 */
declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache | undefined;
}

// Initialise the cache on first import; reuse it on subsequent imports.
const cached: MongooseCache = (global.mongooseCache ??= {
    conn: null,
    promise: null,
});

/**
 * Returns a Mongoose instance connected to MongoDB.
 *
 * On the first call it opens the connection and caches the result.
 * Every subsequent call returns the cached instance immediately,
 * preventing the connection-per-request anti-pattern that is common
 * in serverless / Next.js environments.
 *
 * @returns A resolved Mongoose instance ready for use.
 */
export async function connectToDatabase(): Promise<Mongoose> {
    // Return the existing connection if we already have one.
    if (cached.conn) {
        return cached.conn;
    }

    // If no connection promise exists yet, create one.
    if (!cached.promise) {
        const opts: mongoose.ConnectOptions = {
            /**
             * Keeps the connection alive between serverless function invocations.
             * Without this, Mongoose may time out on idle connections.
             */
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts);
    }

    try {
        // Await the in-flight promise (works whether we just created it or it
        // was already pending from a concurrent request).
        cached.conn = await cached.promise;
    } catch (error) {
        // Reset the promise so the next call can retry the connection.
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}