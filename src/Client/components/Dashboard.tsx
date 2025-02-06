import { useState } from "react"
import InfluencerSearch from "./InfluencerSearch"
import InfluencerList from "./InfluencerList"
import ResearchConfig from "./ResearchConfig"
import type { ResearchConfigType, InfluencerData } from "@/Client/types"
import { useToast } from "@/Client/hooks/useToast"

export default function Dashboard() {
  const [influencers, setInfluencers] = useState<InfluencerData[]>([])
  const [config, setConfig] = useState<ResearchConfigType>({
    dateRange: "7d",
    claimsToAnalyze: 10,
    journals: ["pubmed", "nejm"],
  })
  const { showToast } = useToast()

  const handleAddInfluencer = (newInfluencer: InfluencerData) => {
    setInfluencers((prev) => [...prev, newInfluencer])
    showToast("Influencer added successfully", "success")
  }

  return (
    <div className="space-y-6">
      <ResearchConfig config={config} setConfig={setConfig} />
      <InfluencerSearch config={config} onAddInfluencer={handleAddInfluencer} />
      <InfluencerList influencers={influencers} />
    </div>
  )
}

