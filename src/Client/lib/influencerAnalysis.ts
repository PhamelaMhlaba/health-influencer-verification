import type { ResearchConfigType, InfluencerData, Claim, InfluencerAnalytics } from "@/Client/types"
import { fetchSocialMediaContent } from "./socialMediaApi"
import { extractClaims } from "./perplexityApi"
import { verifyClaims } from "./journalApi"
import { saveInfluencerData, cacheInfluencerData } from "./database"
import { v4 as uuidv4 } from 'uuid';

export async function analyzeInfluencer(name: string, config: ResearchConfigType): Promise<InfluencerData> {
  try {
    // Fetch social media content and extract claims in parallel to optimize time
    const [socialMediaContent, extractedClaims] = await Promise.all([
      fetchSocialMediaContent(name, config.dateRange),
      extractClaims(socialMediaContent, config.claimsToAnalyze)
    ])

    // Remove duplicates in claims using AI logic (simplified)
    const uniqueClaims = removeDuplicateClaims(extractedClaims)

    // Verify claims against scientific journals
    const verifiedClaims = await verifyClaims(uniqueClaims, config.journals)

    // Calculate trust score and analytics
    const { trustScore, analytics } = calculateTrustScoreAndAnalytics(verifiedClaims)

    // Create influencer data object
    const influencerData: InfluencerData = {
      id: generateUniqueId(),
      name,
      trustScore,
      followerCount: socialMediaContent.followerCount,
      claims: verifiedClaims,
      analytics,
    }

    // Save influencer data to database
    await saveInfluencerData(influencerData)

    // Cache influencer data
    await cacheInfluencerData(`influencer:${influencerData.id}`, influencerData)

    return influencerData
  } catch (error) {
    console.error(`Error analyzing influencer: ${name}. Reason:`, error)
    throw new Error("Failed to analyze influencer")
  }
}

function removeDuplicateClaims(claims: Claim[]): Claim[] {
  const seenClaims = new Set();
  return claims.filter((claim) => {
    const uniqueIdentifier = claim.text.toLowerCase();
    if (seenClaims.has(uniqueIdentifier)) {
      return false;
    }
    seenClaims.add(uniqueIdentifier);
    return true;
  });
}

function calculateTrustScoreAndAnalytics(claims: Claim[]): { trustScore: number; analytics: InfluencerAnalytics } {
  const totalClaims = claims.length
  const verifiedClaims = claims.filter((claim) => claim.verificationStatus === "Verified").length
  const questionableClaims = claims.filter((claim) => claim.verificationStatus === "Questionable").length
  const debunkedClaims = claims.filter((claim) => claim.verificationStatus === "Debunked").length

  // Safeguard against division by zero
  const trustScore = totalClaims > 0 ? (verifiedClaims / totalClaims) * 100 : 0
  const averageConfidenceScore = claims.reduce((sum, claim) => sum + claim.confidenceScore, 0) / totalClaims

  const analytics: InfluencerAnalytics = {
    totalClaims,
    verifiedClaims,
    questionableClaims,
    debunkedClaims,
    averageConfidenceScore,
  }

  return { trustScore, analytics }
}

// Generates a unique ID for each influencer using uuid
function generateUniqueId(): string {
  return uuidv4() // UUID ensures globally unique IDs
}
