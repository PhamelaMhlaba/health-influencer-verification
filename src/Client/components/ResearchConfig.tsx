import type { ResearchConfigType } from "@/types"

type Props = {
  config: ResearchConfigType
  setConfig: (config: ResearchConfigType) => void
}

export default function ResearchConfig({ config, setConfig }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setConfig({ ...config, [name]: name === "claimsToAnalyze" ? Number.parseInt(value) : value })
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Research Configuration</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date Range
          </label>
          <select
            id="dateRange"
            name="dateRange"
            value={config.dateRange}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
        <div>
          <label htmlFor="claimsToAnalyze" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Claims to Analyze
          </label>
          <input
            type="number"
            id="claimsToAnalyze"
            name="claimsToAnalyze"
            value={config.claimsToAnalyze}
            onChange={handleChange}
            min="1"
            max="100"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          />
        </div>
        <div>
          <label htmlFor="journals" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Journals
          </label>
          <select
            id="journals"
            name="journals"
            value={config.journals}
            onChange={handleChange}
            multiple
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          >
            <option value="pubmed">PubMed</option>
            <option value="nejm">New England Journal of Medicine</option>
            <option value="jama">Journal of the American Medical Association</option>
          </select>
        </div>
      </div>
    </div>
  )
}

