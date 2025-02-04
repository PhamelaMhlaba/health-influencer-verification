export type ResearchConfigType = {
  dateRange: string
  claimsToAnalyze: number
  journals: string[]
}

export type InfluencerData = {
  id: string
  name: string
  trustScore: number
  followerCount: number
  claims: Claim[]
  analytics: InfluencerAnalytics
}

export type Claim = {
  id: string
  content: string
  category: string
  verificationStatus: "Verified" | "Questionable" | "Debunked"
  confidenceScore: number
}

export type InfluencerAnalytics = {
  totalClaims: number
  verifiedClaims: number
  questionableClaims: number
  debunkedClaims: number
  averageConfidenceScore: number
}

export type PaginatedResponse<T> = {
  data: T[]
  totalCount: number
  currentPage: number
  totalPages: number
}

