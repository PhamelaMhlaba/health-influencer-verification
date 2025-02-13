import type { InfluencerData } from "@/Client/types";
import { connectToDatabase } from "../utils/db";
// import { logger } from ( I nedd to import this)

// Save or update influencer data in the database
export async function saveInfluencerData(influencerData: InfluencerData): Promise<void> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("influencers");

    const updateResult = await collection.updateOne(
      { id: influencerData.id },
      { $set: influencerData },
      { upsert: true } 
    );

    // Log the result of the upsert operation
    if (updateResult.upsertedCount > 0) {
      logger.info(`New influencer data inserted for ID: ${influencerData.id}`);
    } else {
      logger.info(`Influencer data updated for ID: ${influencerData.id}`);
    }
  } catch (error) {
    logger.error("Failed to save influencer data", error); 
    throw error;
  }
}

// Get influencer data by ID
export async function getInfluencerData(id: string): Promise<InfluencerData | null> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("influencers");

    const influencer = await collection.findOne<InfluencerData>({ id });

    if (!influencer) {
      logger.warn(`No influencer found for ID: ${id}`);
    }

    return influencer;
  } catch (error) {
    logger.error("Failed to retrieve influencer data", error); 
    throw error;
  }
}

// Get a paginated list of all influencers, sorted by trust score
export async function getAllInfluencers(page = 1, pageSize = 10) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("influencers");

    // Count total influencers for pagination purposes
    const totalCount = await collection.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    const data = await collection
      .find<InfluencerData>({})
      .sort({ trustScore: -1 }) 
      .skip((page - 1) * pageSize) 
      .limit(pageSize) 
      .toArray();

    return { data, totalCount, currentPage: page, totalPages };
  } catch (error) {
    logger.error("Failed to retrieve influencers", error); 
    throw error;
  }
}
