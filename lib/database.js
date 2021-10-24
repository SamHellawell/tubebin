import { MongoClient, Logger } from 'mongodb';

let dbClient;
let dbPromise;
let cachedDB;

// Make sure this critical env var exists or throw a fatal error
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Database Name
const dbName = 'yt-indexer';

// Returns true/false if database is connected
function isConnected() {
  return !!dbClient && !!dbClient.topology && dbClient.topology.isConnected();
}

// Will connect to a database every time in production mode (serverless)
// or cache and reuse the DB in development mode
export async function connectToDB() {
  Logger.setLevel("debug");

  // Create DB client if required
  const useCachedDB = process.env.NODE_ENV !== 'production';
  if (!dbClient || !useCachedDB) {
    dbClient = new MongoClient(MONGODB_URI, {
      tlsAllowInvalidHostnames: true,
      tlsAllowInvalidCertificates: true,
      tlsInsecure: true,
      // useUnifiedTopology: true,
      useNewUrlParser: true,
      connectTimeoutMS: 2500,
      maxPoolSize: 1,
      minPoolSize: 1,
    });
  }

  // Return cached DB instance (not client) if available
  if (useCachedDB && cachedDB) {
    return Promise.resolve(cachedDB);
  }

  // Cached DB isnt yet available but the DB is, return it
  if (useCachedDB && isConnected()) {
    return Promise.resolve(dbClient.db(dbName));
  } else {
    // If a promise for the db exists, return that
    if (useCachedDB && dbPromise) {
      return dbPromise;
    }

    // Connect to the database
    console.log('Connecting to Mongo...');
    try {
      dbPromise = dbClient.connect()
        .then(() => dbClient.db(dbName));

      const db = await dbPromise;
      console.log('Connection successful, got database:', dbName);
      cachedDB = db;
      return db;
    } catch (err) {
      console.log(err.stack);
    }
  }
}

// Disconnects from the database in production mode
// but in development will keep the connection alive
export async function disconnectDB() {
  if (isConnected() && process.env.NODE_ENV === 'production') {
    console.log('Disconnecting database...')
    await dbClient.close();
    dbClient = undefined;
    dbPromise = undefined;
    cachedDB = undefined;
  }
}
