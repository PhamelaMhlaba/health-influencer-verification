
import { useState, useEffect } from "react"
import { useToast } from "@/Client/hooks/useToast"

type AnalyticsData = {
  totalInfluencers: number
  averageTrustScore: number
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics")
      if (!response.ok) {
        throw new Error("Failed to fetch analytics")
      }
      const data: AnalyticsData = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
      showToast("Failed to fetch analytics", "error")
    }
  }

  if (!analytics) {
    return <div>Loading analytics...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Total Influencers</h2>
        <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{analytics.totalInfluencers}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Average Trust Score</h2>
        <p className="text-4xl font-bold text-green-600 dark:text-green-400">
          {analytics.averageTrustScore.toFixed(2)}%
        </p>
      </div>
    </div>
  )
}

