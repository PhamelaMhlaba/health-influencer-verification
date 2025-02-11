import type { Claim } from "@/Client/types"

// Function to extract claims from health content with rate limiting consideration
export async function extractClaims(content: string, claimsToAnalyze: number): Promise<Claim[]> {
  try {
    // Validate content before making the API request
    if (!content || typeof content !== "string" || content.trim() === "") {
      throw new Error("Content cannot be empty or invalid.")
    }

    const maxRetries = 5 
    const baseDelay = 2000 
    let attempt = 0

    // Feedback mechanism to inform user of the current process
    notifyUser("Processing your request...")

    while (attempt < maxRetries) {
      try {
        // Make API request to extract claims
        const response = await fetch("https://api.perplexity.ai/extract-claims", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          },
          body: JSON.stringify({ content, claimsToAnalyze }),
        })

        // Check for rate limiting
        if (response.status === 429) {
          // If rate-limited, handle backoff with exponential delay
          const retryAfter = response.headers.get("Retry-After")
          const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : Math.pow(2, attempt) * baseDelay 
          console.warn(`Rate limit exceeded. Retrying after ${waitTime / 1000} seconds...`)
          notifyUser(`Rate limit exceeded. Retrying after ${waitTime / 1000} seconds...`)
          await delay(waitTime) 
          attempt++
          continue 
        }

        // Check for response status
        if (!response.ok) {
          throw new Error(`Failed to extract claims. Status: ${response.status}`)
        }

        // Parse the API response data
        const data = await response.json()

        // Validate the response structure
        if (!data.claims || !Array.isArray(data.claims)) {
          throw new Error("Invalid response structure from Perplexity API")
        }

        // Process the claims and return them in the expected format
        notifyUser("Claims successfully extracted.")
        return data.claims.map((claim: any) => ({
          id: claim.id || generateUniqueId(),
          content: claim.content || "Content not available",
          category: claim.category || "Uncategorized",
          verificationStatus: "Questionable",
          confidenceScore: claim.confidenceScore || 0,
        }))
      } catch (error: unknown) { // Explicitly define the error type as 'unknown'
        // Cast error to an instance of the Error type
        if (error instanceof Error) {
          console.error("Error extracting claims:", error.message || error)
          notifyUser("Error extracting claims. Please try again later.")
          throw new Error(`Failed to extract claims: ${error.message || error}`)
        } else {
          console.error("Unexpected error:", error)
          notifyUser("Unexpected error occurred.")
          throw new Error("Unexpected error occurred.")
        }
      }
    }

    // If max retries are reached and still failed, throw an error
    throw new Error("Max retries reached. Unable to extract claims.")
  } catch (error: unknown) { // Handle errors from outer try-catch block
    // Cast error to an instance of the Error type
    if (error instanceof Error) {
      console.error("Error processing claims:", error.message || error)
      throw new Error(`Failed to extract claims: ${error.message || error}`)
    } else {
      console.error("Unexpected error:", error)
      throw new Error("Unexpected error occurred.")
    }
  }
}

// Helper function to generate a unique ID for claims
function generateUniqueId(): string {
  return `claim-${Math.floor(Math.random() * 1000000)}`
}

// Helper function to introduce delay for rate-limiting
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Feedback mechanism: Provide feedback to the user (e.g., showing notifications or console messages)
function notifyUser(message: string): void {
  //sending a message to the user interface
  console.log(`User Feedback: ${message}`)
}
