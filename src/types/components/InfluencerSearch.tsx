import { useState } from "react"
import type { ResearchConfigType, InfluencerData } from "/"
import { useToast } from ""

type Props = {
  config: ResearchConfigType
  onAddInfluencer: (influencer: InfluencerData) => void
}

export default function InfluencerSearch({ config, onAddInfluencer }: Props) {
  const [influencerName, setInfluencerName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/analyze-influencer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: influencerName, config }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze influencer")
      }

      const data = await response.json()
      onAddInfluencer(data)
      setInfluencerName("")
    } catch (error) {
      console.error("Error analyzing influencer:", error)
      showToast("Failed to analyze influencer", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={influencerName}
        onChange={(e) => setInfluencerName(e.target.value)}
        placeholder="Enter influencer name"
        className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        {isLoading ? "Analyzing..." : "Analyze"}
      </button>
    </form>
  )
}

