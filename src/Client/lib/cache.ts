import { createClient, type RedisClientType } from "redis"
import type { InfluencerData, PaginatedResponse } from "@/types"

class RedisCache {
  private client: RedisClientType
  private static instance: RedisCache

  private constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    })

    this.client.on("error", (err) => {
      console.error("Redis Client Error", err)
    })

    this.client.connect().catch((err) => {
      console.error("Failed to connect to Redis", err)
    })
  }

  public static getInstance(): RedisCache {
    if (!RedisCache.instance) {
      RedisCache.instance = new RedisCache()
    }
    return RedisCache.instance
  }

  public async cacheInfluencerData(
    key: string,
    data: InfluencerData | PaginatedResponse<InfluencerData>,
    expirationInSeconds = 3600,
  ): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(data), {
        EX: expirationInSeconds,
      })
      console.log(`Successfully cached data for key: ${key}`)
    } catch (error) {
      console.error(`Error caching data for key ${key}:`, error)
      throw new Error(`Failed to cache influencer data: ${error.message}`)
    }
  }

  public async getCachedInfluencerData(
    key: string,
  ): Promise<InfluencerData | PaginatedResponse<InfluencerData> | null> {
    try {
      const cachedData = await this.client.get(key)
      if (cachedData) {
        console.log(`Cache hit for key: ${key}`)
        return JSON.parse(cachedData)
      }
      console.log(`Cache miss for key: ${key}`)
      return null
    } catch (error) {
      console.error(`Error retrieving cached data for key ${key}:`, error)
      throw new Error(`Failed to retrieve cached influencer data: ${error.message}`)
    }
  }

  public async invalidateCache(key: string): Promise<void> {
    try {
      await this.client.del(key)
      console.log(`Successfully invalidated cache for key: ${key}`)
    } catch (error) {
      console.error(`Error invalidating cache for key ${key}:`, error)
      throw new Error(`Failed to invalidate cache: ${error.message}`)
    }
  }
}

export const redisCache = RedisCache.getInstance()

