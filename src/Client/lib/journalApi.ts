import type { Claim } from "@/Client/types";

/**
 * Verifies multiple claims against multiple journals asynchronously.
 * @param claims - The claims to verify.
 * @param journals - The journals to verify against.
 * @returns A promise resolving to an array of verified claims.
 */
export async function verifyClaims(claims: Claim[], journals: string[]): Promise<Claim[]> {
  return Promise.all(
    claims.map(async (claim) => {
      try {
        const verificationResults = await Promise.all(
          journals.map((journal) => verifyClaimInJournal(claim, journal))
        );
        const overallVerification = aggregateVerificationResults(verificationResults);
        return { ...claim, ...overallVerification };
      } catch (error) {
        console.error(`Error verifying claim ${claim.id}:`, error);
        return { ...claim, verificationStatus: "Unknown", confidenceScore: 0 };
      }
    })
  );
}

/**
 * Verifies a claim against a journal.
 * (Replace the placeholder logic with an actual API call)
 * @param claim - The claim to verify.
 * @param journal - The journal to check.
 * @returns A promise resolving to verification status and confidence score.
 */
async function verifyClaimInJournal(claim: Claim, journal: string): Promise<{ status: string; confidence: number }> {
  try {
    // TODO: Replace this placeholder with an actual API call to the journal's verification endpoint.
    // Example:
    // const response = await fetch(`https://api.journal.com/verify`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ claim, journal }),
    // });
    // const data = await response.json();
    // return { status: data.status, confidence: data.confidence };

    // Placeholder logic (REMOVE when integrating the API)
    return new Promise((resolve) => {
      setTimeout(() => {
        const random = Math.random();
        if (random < 0.6) {
          resolve({ status: "Verified", confidence: 0.7 + Math.random() * 0.3 });
        } else if (random < 0.9) {
          resolve({ status: "Questionable", confidence: 0.4 + Math.random() * 0.3 });
        } else {
          resolve({ status: "Debunked", confidence: 0.7 + Math.random() * 0.3 });
        }
      }, 1000);
    });
  } catch (error) {
    console.error(`Error fetching verification data from ${journal}:`, error);
    return { status: "Unknown", confidence: 0 };
  }
}

/**
 * Aggregates verification results from multiple journals.
 * Determines the final verification status and confidence score.
 * @param results - Array of verification results.
 * @returns Final verification status and confidence score.
 */
function aggregateVerificationResults(results: { status: string; confidence: number }[]): {
  verificationStatus: "Verified" | "Questionable" | "Debunked";
  confidenceScore: number;
} {
  const statusCounts: Record<string, number> = {};
  const confidenceByStatus: Record<string, number[]> = {};

  // Count occurrences and collect confidence scores per status
  results.forEach(({ status, confidence }) => {
    statusCounts[status] = (statusCounts[status] || 0) + 1;
    confidenceByStatus[status] = confidenceByStatus[status] || [];
    confidenceByStatus[status].push(confidence);
  });

  // Determine the most frequent status
  const highestStatus = Object.keys(statusCounts).reduce((a, b) =>
    statusCounts[a] > statusCounts[b] ? a : b
  );

  // Calculate average confidence for the most frequent status
  return {
    verificationStatus: highestStatus as "Verified" | "Questionable" | "Debunked",
    confidenceScore:
      confidenceByStatus[highestStatus]?.reduce((a, b) => a + b, 0) /
        confidenceByStatus[highestStatus].length || 0,
  };
}
