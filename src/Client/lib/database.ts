import { MongoClient } from "mongodb"
import type { InfluencerData, PaginatedResponse } from "@/Client/types"

// MongoDB URI and client setup


// Cached database connection to avoid reconnecting on each request
let cachedDb: any = null
const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error("MONGODB_URI environment variable is not defined")
}
const client = new MongoClient(uri)
/**
 * Connects to the MongoDB database. Uses cached connection if available.
 * @returns {Promise<any>} The connected database instance.
 */
async function connectToDatabase() {
  try {
    if (cachedDb) {
      return cachedDb
    }

    // Establish a new connection if not cached
    await client.connect()
    const db = client.db("health_influencer_verification")
    cachedDb = db

    // Set up necessary indexes for performance improvements
    await setupIndexes(db)

    return db
  } catch (error) {
    console.error("Error connecting to the database:", error)
    throw new Error("Database connection failed")
  }
}

/**
 * Creates necessary indexes for the influencer collection to improve query performance.
 * @param {any} db - The database instance.
 */
async function setupIndexes(db: any) {
  const collection = db.collection("influencers")
  
  // Create indexes on fields commonly used for sorting and querying
  await collection.createIndex({ id: 1 })
  await collection.createIndex({ trustScore: -1 })
}

/**
 * Saves influencer data to the database, using upsert to prevent duplicate entries.
 * @param {InfluencerData} influencerData - The influencer data to be saved.
 * @returns {Promise<void>}
 */
export async function saveInfluencerData(influencerData: InfluencerData): Promise<void> {
  try {
    const db = await connectToDatabase()
    const collection = db.collection("influencers")

    // Upsert the influencer data based on the influencer's ID
    await collection.updateOne({ id: influencerData.id }, { $set: influencerData }, { upsert: true })
    console.log(`Successfully saved influencer data with ID: ${influencerData.id}`)
  } catch (error) {
    console.error("Error saving influencer data:", error)
    throw new Error("Failed to save influencer data")
  }
}

/**
 * Retrieves influencer data by ID.
 * @param {string} id - The influencer ID.
 * @returns {Promise<InfluencerData | null>} The influencer data, or null if not found.
 */
export async function getInfluencerData(id: string): Promise<InfluencerData | null> {
  try {
    const db = await connectToDatabase()
    const collection = db.collection("influencers")
    return await collection.findOne({ id })
  } catch (error) {
    console.error(`Error fetching influencer data for ID ${id}:`, error)
    throw new Error("Failed to retrieve influencer data")
  }
}

/**
 * Retrieves a paginated list of influencers.
 * @param {number} [page=1] - The current page number.
 * @param {number} [pageSize=10] - The number of influencers per page.
 * @returns {Promise<PaginatedResponse<InfluencerData>>} A paginated response with influencer data.
 */
export async function getAllInfluencers(page = 1, pageSize = 10): Promise<PaginatedResponse<InfluencerData>> {
  try {
    const db = await connectToDatabase()
    const collection = db.collection("influencers")

    // Get total influencer count for pagination
    const totalCount = await collection.countDocuments()
    const totalPages = Math.ceil(totalCount / pageSize)

    // Fetch the influencers for the current page
    const data = await collection
      .find({})
      .sort({ trustScore: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray()

    return {
      data,
      totalCount,
      currentPage: page,
      totalPages,
    }
  } catch (error) {
    console.error("Error fetching paginated influencers:", error)
    throw new Error("Failed to retrieve influencers")
  }
}

/**
 * Retrieves analytics for influencers, including the total number and average trust score.
 * @returns {Promise<{ totalInfluencers: number; averageTrustScore: number }>} The influencer analytics.
 */
export async function getInfluencerAnalytics(): Promise<{ totalInfluencers: number; averageTrustScore: number }> {
  try {
    const db = await connectToDatabase()
    const collection = db.collection("influencers")

    // Aggregate total influencers and average trust score
    const result = await collection
      .aggregate([
        {
          $group: {
            _id: null,
            totalInfluencers: { $sum: 1 },
            averageTrustScore: { $avg: "$trustScore" },
          },
        },
      ])
      .toArray()

    return result[0] || { totalInfluencers: 0, averageTrustScore: 0 }
  } catch (error) {
    console.error("Error fetching influencer analytics:", error)
    throw new Error("Failed to retrieve influencer analytics")
  }
}
