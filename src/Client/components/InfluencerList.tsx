import { useState, useEffect } from "react";
import Link from "next/link";
import type { InfluencerData, PaginatedResponse } from "@/Client/types";
import { useToast } from "@/Client/hooks/useToast";

// Add 'influencers' prop to the component
type InfluencerListProps = {
  influencers: InfluencerData[]; // Define influencers as a prop
};

export default function InfluencerList({ influencers }: InfluencerListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchInfluencers(currentPage);
  }, [currentPage]);

  const fetchInfluencers = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/influencers?page=${page}&pageSize=10`);
      if (!response.ok) {
        throw new Error("Failed to fetch influencers");
      }
      const data: PaginatedResponse<InfluencerData> = await response.json();
      // Since influencers are passed as a prop, no need to set them here.
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching influencers:", error);
      showToast("Failed to fetch influencers", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Trust Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Followers
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {influencers.map((influencer) => (
            <tr key={influencer.id}>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-300">{influencer.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-300">
                {influencer.trustScore.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-300">
                {influencer.followerCount.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/influencer/${influencer.id}`}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-6 py-4 flex justify-between items-center bg-gray-50 dark:bg-gray-700">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || isLoading}
          className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || isLoading}
          className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
