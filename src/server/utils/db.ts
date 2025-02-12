import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.DB_NAME || "health_influencer_verification"; 
const client = new MongoClient(uri);

let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  // If the database is already cached, return the cached connection
  if (cachedDb) return cachedDb;

  try {
    // Attempt to connect to the database
    await client.connect();
    const db = client.db(dbName); 
    cachedDb = db; 
    return db;
  } catch (error) {
    console.error("Failed to connect to the database", error);
    throw error; 
  }
}
